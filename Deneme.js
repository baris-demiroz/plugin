/**
 * DenemePlugin — ŞİFRELİ örnek
 *
 * baseUrl, "brs" anahtarıyla AES-256-CBC ile şifrelenmiştir.
 * Şifreyi çözmek için: engine.resolve("ENC:...")
 * Bu sayede baseUrl GitHub'da açık görünmez.
 *
 * Şifreleme yapmak için: node backend/scripts/encrypt-helper.mjs
 *
 * Bu plugin'in yanında bir .meta.json dosyası olmalıdır:
 *   deneme.meta.json → { "pass": "brs" }
 *
 * Manifest'te de "pass" alanı eklenir:
 *   { "name": "Deneme", "pass": "brs", "entry": { "url": "..." } }
 */
class Deneme {
    constructor() {
        this.name   = "Deneme";
        this.domain = "MUSIC";

        // Şifrelenmiş baseUrl — engine.resolve() çözer
        // Düz hali: deneme.com
        this.baseUrl = engine.resolve("ENC:y4Ah7LHLVvlsUhZyqjHvn7F+1WSgbM8OWO+UMB0D9K4=");
    }

    getType(url) {
        if (url.includes("/akor-tab/")) return "ARTIST";
        if (url.includes("/akor/"))     return "CHORD";
        return "CHORD";
    }

    async search(query) {
        engine.log(`[Deneme] Searching: ${query}`);

        const url  = `${this.baseUrl}/ara/${encodeURIComponent(query)}`;
        const html = await engine.fetch(url);
        const $    = engine.parseHTML(html);

        const results = [];

        $("ul li a").each((_, el) => {
            const href  = $(el).attr("href")?.trim();
            const title = $(el).find(".title").text().trim();

            if (!href || !title) return;

            results.push({
                id:       href,
                title,
                artist:   title.split(" - ")[0] || "Unknown",
                url:      href.startsWith("http") ? href : `${this.baseUrl}${href}`,
                type:     this.getType(href),
                domain:   "MUSIC",
                provider: this.name
            });
        });

        return results;
    }

    async getArtistsSongs(url) {

          engine.log(`[Deneme] GET ARTISTS SONGS: ${url}`);

    const html = await engine.fetch(url);
    const $ = engine.parseHTML(html);

    const results = [];
        const container = $(".list-list.list-open.split-2");


       container.find("ul li a").each((_, el) => {
            const href  = $(el).attr("href")?.trim();
            const title = $(el).find(".title").text().trim();

            if (!href || !title) return;

            results.push({
                id:       href,
                title,
                artist:   title.split(" - ")[0] || "Unknown",
                url:      href.startsWith("http") ? href : `${this.baseUrl}${href}`,
                type:     "CHORD",
                domain:   "MUSIC",
                provider: this.name
            });
        });

        return results;
    }

    async get(id) {
        engine.log(`[Deneme] GET: ${id}`);

        let url = id;
        if (!id.startsWith("http")) {
            url = `${this.baseUrl}${id.startsWith("/") ? "" : "/"}${id}`;
        }

        const html = await engine.fetch(url);
        const $    = engine.parseHTML(html);

        const h1Text = $("h1").first().text().trim() || $("title").text().trim();
        const parts  = h1Text.split(" - ");

        const artist  = parts.length > 1 ? parts[0]    : "Unknown";
        const title   = parts.length > 1 ? parts[1]    : h1Text;
        const content = $("pre").first().text()?.trim() || "";

        return {
            title,
            artist,
            content,
            type:     "CHORD",
            domain:   "MUSIC",
            provider: this.name
        };
    }
}

module.exports = Deneme;
