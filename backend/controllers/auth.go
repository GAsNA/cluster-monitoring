package controllers

import (
	"log"
	"os"
	"net/http"
	"bytes"
	"encoding/json"
	"fmt"
)

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-type", "application/json;charset=UTF-8")

	error := r.URL.Query().Get("error")
	error_description := r.URL.Query().Get("error_description")
	if error != "" && error_description != "" {
		url_redirect := "http://localhost:4200?error=" + error + "&error_description=" + error_description
		http.Redirect(w, r, url_redirect, http.StatusSeeOther) // change status
		return
	}

	code := r.URL.Query().Get("code")

	body, _ := json.Marshal(map[string]string{
				"grant_type": "authorization_code",
				"client_id": os.Getenv("UID"),
				"client_secret": os.Getenv("SECRET"),
				"code": code,
				"redirect_uri": "http://localhost:3000/auth/login",
			})

	resp, err := http.Post("https://api.intra.42.fr/oauth/token", "application/json", bytes.NewBuffer(body))
	if err != nil { log.Fatal(err) }

	defer resp.Body.Close()

    var res map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&res)
    fmt.Println(res)

	http.Redirect(w, r, "http://localhost:4200", http.StatusSeeOther) // change status
}

func Logout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)
}
