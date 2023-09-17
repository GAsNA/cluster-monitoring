package jwt

import (
	"golang-jwt"
	"os"

	"main/models"
)

func generateJWT(user *models.User) (string, error) {
	token := jwt.New(jwt.SigningMethodEdDSA)

	claims := token.Claims.(jwt.MapClaims)
	claims["user"] = user

	tokenString, err := token.SignedString(os.Getenv("JWT_KEY"))
	if err != nil { return "", err }

	return tokenString, nil
}
