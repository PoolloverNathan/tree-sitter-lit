import XCTest
import SwiftTreeSitter
import TreeSitterLit

final class TreeSitterLitTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_lit())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Lit grammar")
    }
}
