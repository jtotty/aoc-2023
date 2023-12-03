package main

import (
	"os"
	"fmt"
	"bytes"
	"strings"
)

func main() {
	file, err := os.Open("../data/p1/test.txt")
	if err != nil {
		fmt.Print(err)
	}
	defer file.Close()

	buf := new(bytes.Buffer)
	buf.ReadFrom(file)
	content := strings.TrimSpace(buf.String())

	lines := strings.Split(content, "\n")

	for _, line := range lines {
		fmt.Println(line)
	}
}
