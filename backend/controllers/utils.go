package controllers

import (
	"net/http"
	"errors"
	"strings"

	"main/jwt"

	ext_jwt "github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader {
	ReadBufferSize:		1024,
	WriteBufferSize:	1024,
	CheckOrigin:		func(r *http.Request) bool { return true },
}

func addHeadersCommon(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
	(*w).Header().Set("Content-type", "application/json;charset=UTF-8")
}

func addHeadersGet(w *http.ResponseWriter, total_count, page, total_pages, per_page string) {
	(*w).Header().Set("X-Total-Count", total_count)
	(*w).Header().Set("X-Page", page)
	(*w).Header().Set("X-Total-Pages", total_pages)
	(*w).Header().Set("X-Per-Page", per_page)
}

func verifyJwtAndClaims(w *http.ResponseWriter, r *http.Request) (*jwt.Claims, error) {
	if r.Method == "OPTIONS" {
		return (*jwt.Claims)(nil), errors.New("OPTIONS are skipped")
	}

	token := r.Header.Get("Authorization")
	if token == "" {
		(*w).WriteHeader(http.StatusUnauthorized)
		return (*jwt.Claims)(nil), errors.New("No header Authorization")
	}
	splitToken := strings.Split(token, "Bearer ")
	token = splitToken[1]

	claims, err := jwt.VerifyJWT(token)
	if err != nil {
		if err == ext_jwt.ErrSignatureInvalid || err == errors.New("Token invalid") {
			(*w).WriteHeader(http.StatusUnauthorized)
			return (*jwt.Claims)(nil), err
		} 
		(*w).WriteHeader(http.StatusBadRequest)
		return (*jwt.Claims)(nil), err
	}

	return claims, nil
}

func checkRights(w *http.ResponseWriter, r *http.Request, claims *jwt.Claims) error {
	if claims.User.IsStaff { return nil }

	(*w).WriteHeader(http.StatusForbidden)
	return errors.New("No enough rights")
}
