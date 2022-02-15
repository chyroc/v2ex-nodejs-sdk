package main

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

//go:embed planes.html
var html string

type Box struct {
	Title string  `json:"title"`
	Name  string  `json:"name"`
	Nodes []*Node `json:"nodes"`
}

type Node struct {
	Title string `json:"title"`
	Name  string `json:"name"`
}

func main() {
	d, _ := goquery.NewDocumentFromReader(strings.NewReader(html))
	boxes := []*Box{}
	d.Find(".box").Each(func(i int, selection *goquery.Selection) {
		if len(selection.Find(".header").First().Children().Nodes) > 0 {
			title := selection.Find(".header").First().Children().Nodes[0].NextSibling.Data
			title = strings.TrimSpace(title)

			name := selection.Find(".header").First().Find("span").Text()
			name = strings.TrimSpace(strings.SplitN(name, `•`, 2)[0])
			box := &Box{
				Title: title,
				Name:  name,
				Nodes: nil,
			}

			selection.Find(".inner > a").Each(func(i int, a *goquery.Selection) {
				nodeName := strings.TrimSpace(strings.SplitN(a.AttrOr("href", ""), "/go/", 2)[1])
				nodeTitle := strings.TrimSpace(a.Text())

				box.Nodes = append(box.Nodes, &Node{
					Title: nodeTitle,
					Name:  nodeName,
				})
			})

			boxes = append(boxes, box)
		}
		// fmt.Println(selection.Find(".header").First().Text())
		// fmt.Println(i, selection.Text())
	})

	bs, _ := json.Marshal(boxes)
	fmt.Println(string(bs))
}
