package tree_sitter_lit_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_lit "github.com/tree-sitter/tree-sitter-lit/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_lit.Language())
	if language == nil {
		t.Errorf("Error loading Lit grammar")
	}
}
