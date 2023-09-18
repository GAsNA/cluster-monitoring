package jwt

import (
	"os"
	"errors"
	"time"

	"main/models"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	User	*models.User	`json:"user"`
	jwt.RegisteredClaims
}

var jwtKey = []byte(os.Getenv("JWT_KEY"))

func GenerateJWT(user *models.User) (string, error) {
	expirationTime := time.Now().Add(7 * 24 * time.Hour)
	
	claims := &Claims{
		User: user,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil { return "", err }

	return tokenString, nil
}

func VerifyJWT(tknStr string) (*Claims, error) {
	claims := &Claims{}

	tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (any, error) {
		return jwtKey, nil
	})
	if err != nil { return (*Claims)(nil), err }
	
	if !tkn.Valid { return (*Claims)(nil), errors.New("Token invalid") }

	return claims, nil
}
