// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterLit",
    products: [
        .library(name: "TreeSitterLit", targets: ["TreeSitterLit"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterLit",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterLitTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterLit",
            ],
            path: "bindings/swift/TreeSitterLitTests"
        )
    ],
    cLanguageStandard: .c11
)
