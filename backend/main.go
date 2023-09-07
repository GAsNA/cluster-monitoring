package main

import (
	"fmt"
	"main/config"
)

func main() {
	fmt.Println("HELLO!")
	config.DatabaseInit()
}
