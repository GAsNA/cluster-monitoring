package controllers

import (
	"os"
	"net/http"
	"bytes"
	"encoding/json"
	"fmt"
	"time"
	"strconv"

	"main/models"
	"main/jwt"
)

func Me(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(claims.User)
}

func Login(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	error := r.URL.Query().Get("error")
	error_description := r.URL.Query().Get("error_description")
	if error != "" && error_description != "" {
		url_redirect := "http://localhost:4200?error=" + error + "&error_description=" + error_description
		http.Redirect(w, r, url_redirect, http.StatusSeeOther) // change status
		return
	}

	// Request to get intra token
	code := r.URL.Query().Get("code")
	body, _ := json.Marshal(map[string]string{
				"grant_type": "authorization_code",
				"client_id": os.Getenv("UID"),
				"client_secret": os.Getenv("SECRET"),
				"code": code,
				"redirect_uri": "http://localhost:3000/auth/login",
			})

	resp, err := http.Post("https://api.intra.42.fr/oauth/token", "application/json", bytes.NewBuffer(body))
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }
	defer resp.Body.Close()

    var res map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&res)

	// Request to get user information
	req, err := http.NewRequest("GET", "https://api.intra.42.fr/v2/me", nil)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }
    req.Header.Add("Authorization", "Bearer " + fmt.Sprintf("%v", res["access_token"]))

    client := &http.Client{}
    resp, err = client.Do(req)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }
    defer resp.Body.Close()

    json.NewDecoder(resp.Body).Decode(&res)

	// Check primary campus
	primary_campus_is_paris := false
	for _, item := range res["campus_users"].([]interface{}) {
		is_primary := (item.(map[string]interface{})["is_primary"]).(bool)
		campus_id := int((item.(map[string]interface{})["campus_id"]).(float64))

		if is_primary && campus_id == 1 {
			primary_campus_is_paris = true
			break
		}
	}

	if !primary_campus_is_paris {
		url_redirect := "http://localhost:4200?error=" + "not_paris" + "&error_description=" + "The primary campus is not Paris. You are not allowed."
		http.Redirect(w, r, url_redirect, http.StatusSeeOther) // change status
		return
	}

	// Add user in DB if not exist
	user_id_intra := int(res["id"].(float64))
	user_login := res["login"].(string)
	user_image := res["image"].(map[string]interface{})["link"].(string)
	user_is_staff := res["staff?"].(bool)

	user, err := models.FindUserByIDIntra(user_id_intra)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }
	
	if user == (*models.User)(nil) {
		user = &models.User{ IDIntra: user_id_intra, Login: user_login, Image: user_image, IsStaff: user_is_staff }
		models.NewUser(user)
	} else if user.Image != user_image || user.IsStaff != user_is_staff {
		user = &models.User{ IDIntra: user_id_intra, Login: user_login, Image: user_image, IsStaff: user_is_staff }
		models.UpdateUser(user)
	}

	// PROVISIONAL: to delete
	if r.URL.Query().Get("state") == "true" {
		user, err = models.FindUserByLogin("renard")
	}

	// Set JWT cookie and redirect
	token, err := jwt.GenerateJWT(user)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }
	http.SetCookie(w, &http.Cookie{
						Name: "token",
						Value: token,
						Path: "/",
						Expires: time.Now().Add(7 * 24 * time.Hour),
					})

	http.Redirect(w, r, "http://localhost:4200", http.StatusSeeOther) // change status
}

func Logout(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)
	w.WriteHeader(http.StatusOK)
}

func Anonymisation(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Change IDIntra to 0/null, Login to deleted-user-{ID},
		// Image to empty string (or default image?), IsStaff to false
	user := claims.User
	user.IDIntra = 0
	user.Login = "deleted-user-" + strconv.Itoa(user.ID)
	user.Image = ""
	user.IsStaff = false

	models.UpdateUser(user)

	w.WriteHeader(http.StatusOK)
}
