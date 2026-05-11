// Plugin environment provides a global `engine` object.
// The plugin MUST assign a class/constructor to `module.exports`.

class Site2 {
    constructor() {
        this.name = "Site2";
        this.domain = "MUSIC"; // DomainType.MUSIC equivalent
        this.baseUrl = "https://example-plugin1.com";
    }

    async search(query) {
        engine.log(`Searching for: ${query}`);
        
        // Use the controlled fetch API instead of raw axios
        // In a real plugin, you would fetch from this.baseUrl
        // const response = await engine.fetch(`https://dummyjson.com/products/search?q=${query}`);
        
        // Mock response
        return [
            {
                id: "site2-1",
                title: `${query} (site2 Result)`,
                artist: "Plugin Artist",
                url: `${this.baseUrl}/item/1`,
                type: "CHORD" // ContentType.CHORD
            }
        ];
    }

    async get(id) {
        engine.log(`Fetching details for: ${id}`);
        
        // Use engine.parseHTML instead of raw cheerio
        const $ = engine.parseHTML(`
            <html>
                <title>Mock Page</title>
                <body>
                    <pre class="chords">[Am]Plugin [C]Chord</pre>
                </body>
            </html>
        `);
        
        const content = $("pre.chords").text();

        return {
            title: "Example Title",
            artist: "Plugin Artist",
            content: content,
            type: "CHORD - update deneme"
        };
    }
}

module.exports = Site2;
