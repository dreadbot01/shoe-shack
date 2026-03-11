/* ============================================
   SHOE SACK — Database Service (Class-based)
   Product catalog with search, filter, sort
   ============================================ */

const PRODUCTS = [
    // ===== MEN'S SHOES =====
    { id: 1, brand: "Nike", name: "Air Max 270 React", description: "Lightweight cushioned running shoe with React foam and visible Air unit for all-day comfort.", price: 4995, mrp: 8995, discount: 44, sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Black", "White", "Navy"], category: "Running", gender: "Men", rating: 4.5, reviewCount: 3842, images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"], stock: 85 },
    { id: 2, brand: "Adidas", name: "Ultraboost 22", description: "Premium running shoe with Boost midsole technology and Primeknit upper for sock-like fit.", price: 5999, mrp: 11999, discount: 50, sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"], colors: ["Core Black", "Cloud White", "Grey"], category: "Running", gender: "Men", rating: 4.7, reviewCount: 5120, images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600"], stock: 62 },
    { id: 3, brand: "Puma", name: "RS-X3 Puzzle", description: "Retro-inspired chunky sneaker with bold color blocking and comfortable cushioning.", price: 3499, mrp: 6999, discount: 50, sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["White", "Blue", "Red"], category: "Sneakers", gender: "Men", rating: 4.2, reviewCount: 1856, images: ["https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600"], stock: 110 },
    { id: 4, brand: "New Balance", name: "574 Classic", description: "Iconic heritage sneaker with ENCAP midsole technology and suede/mesh upper.", price: 4299, mrp: 7499, discount: 43, sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Grey", "Navy", "Green"], category: "Sneakers", gender: "Men", rating: 4.4, reviewCount: 4230, images: ["https://images.unsplash.com/photo-1539185441755-769473a23570?w=600"], stock: 95 },
    { id: 5, brand: "Jordan", name: "Air Jordan 1 Retro High", description: "The iconic basketball sneaker that started it all. Premium leather upper with Nike Air cushioning.", price: 8999, mrp: 14999, discount: 40, sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Chicago Red", "Royal Blue", "Shadow Grey"], category: "Sneakers", gender: "Men", rating: 4.8, reviewCount: 8940, images: ["https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600"], stock: 30 },
    { id: 6, brand: "Converse", name: "Chuck Taylor All Star", description: "The timeless canvas sneaker. Classic vulcanized construction with signature rubber toe cap.", price: 2499, mrp: 4999, discount: 50, sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"], colors: ["Black", "White", "Red", "Navy"], category: "Casual", gender: "Men", rating: 4.3, reviewCount: 12500, images: ["https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600"], stock: 200 },
    { id: 7, brand: "Vans", name: "Old Skool Classic", description: "Legendary skate shoe with iconic side stripe. Durable canvas and suede upper with waffle outsole.", price: 2999, mrp: 5499, discount: 45, sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Black/White", "Navy", "Checkerboard"], category: "Casual", gender: "Men", rating: 4.4, reviewCount: 9800, images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600"], stock: 150 },
    { id: 8, brand: "Reebok", name: "Classic Leather", description: "Heritage court shoe with soft garment leather upper and die-cut EVA midsole for lightweight cushioning.", price: 2799, mrp: 5999, discount: 53, sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["White", "Black", "Grey"], category: "Casual", gender: "Men", rating: 4.1, reviewCount: 3210, images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"], stock: 130 },
    { id: 9, brand: "Nike", name: "Air Force 1 '07", description: "The legend lives on. Crisp white leather upper with Air-Sole unit for comfort that lasts.", price: 4495, mrp: 7995, discount: 44, sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"], colors: ["White", "Black", "Wheat"], category: "Sneakers", gender: "Men", rating: 4.6, reviewCount: 15200, images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600"], stock: 180 },
    { id: 10, brand: "Timberland", name: "6-Inch Premium Boot", description: "The original yellow boot. Waterproof construction with padded collar and rugged lug outsole.", price: 7999, mrp: 13999, discount: 43, sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Wheat", "Black", "Brown"], category: "Boots", gender: "Men", rating: 4.5, reviewCount: 6780, images: ["https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600"], stock: 55 },
    { id: 11, brand: "Clarks", name: "Desert Boot", description: "Timeless ankle boot with crepe sole and premium suede upper. A wardrobe essential.", price: 5499, mrp: 9999, discount: 45, sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Sand Suede", "Beeswax", "Dark Brown"], category: "Boots", gender: "Men", rating: 4.3, reviewCount: 4560, images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600"], stock: 70 },
    { id: 12, brand: "Allen Edmonds", name: "Park Avenue Oxford", description: "Handcrafted cap-toe oxford in premium calfskin leather. Goodyear welted for resoling.", price: 12999, mrp: 19999, discount: 35, sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Black", "Walnut", "Dark Chili"], category: "Formal", gender: "Men", rating: 4.7, reviewCount: 2340, images: ["https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600"], stock: 25 },
    { id: 13, brand: "Under Armour", name: "HOVR Phantom 3", description: "Connected running shoe with HOVR cushioning that gives back energy with every step.", price: 4999, mrp: 8999, discount: 44, sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Black", "White", "Blue"], category: "Running", gender: "Men", rating: 4.3, reviewCount: 2145, images: ["https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600"], stock: 78 },
    { id: 14, brand: "ASICS", name: "Gel-Kayano 29", description: "Stability running shoe with GEL technology and 3D Space Construction for maximum support.", price: 5499, mrp: 9999, discount: 45, sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Black", "Blue", "Grey"], category: "Running", gender: "Men", rating: 4.6, reviewCount: 3890, images: ["https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600"], stock: 65 },
    { id: 15, brand: "Adidas", name: "Stan Smith", description: "The clean, green icon. Smooth leather upper with perforated 3-Stripes and green heel tab.", price: 3499, mrp: 6999, discount: 50, sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"], colors: ["White/Green", "White/Navy", "White/Red"], category: "Casual", gender: "Men", rating: 4.5, reviewCount: 11200, images: ["https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600"], stock: 160 },
    { id: 16, brand: "Nike", name: "Zoom Pegasus 40", description: "Responsive daily trainer with Zoom Air units in the forefoot and heel for springy cushioning.", price: 4495, mrp: 7995, discount: 44, sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Black", "White", "Blue"], category: "Running", gender: "Men", rating: 4.4, reviewCount: 6720, images: ["https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600"], stock: 90 },
    { id: 17, brand: "Dr. Martens", name: "1460 8-Eye Boot", description: "The original rebellious boot. Smooth leather, air-cushioned sole, and iconic yellow stitching.", price: 8499, mrp: 14999, discount: 43, sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Black", "Cherry Red", "White"], category: "Boots", gender: "Men", rating: 4.6, reviewCount: 5430, images: ["https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?w=600"], stock: 40 },
    { id: 18, brand: "Skechers", name: "Go Walk 6", description: "Ultra-lightweight walking shoe with Arch Fit insole and responsive Ultra Go cushioning.", price: 2999, mrp: 5499, discount: 45, sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Black", "Navy", "Grey"], category: "Casual", gender: "Men", rating: 4.2, reviewCount: 7650, images: ["https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600"], stock: 140 },
    { id: 19, brand: "Puma", name: "Suede Classic XXI", description: "The iconic B-boy sneaker in premium suede with the classic formstrip and thick rubber outsole.", price: 2999, mrp: 5499, discount: 45, sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Black", "Blue", "Red", "Green"], category: "Sneakers", gender: "Men", rating: 4.3, reviewCount: 4120, images: ["https://images.unsplash.com/photo-1608379743498-63cc8cc88a8d?w=600"], stock: 120 },
    { id: 20, brand: "Hush Puppies", name: "Mall Walker Oxford", description: "Comfortable dress-casual oxford with bounce technology and moisture-wicking lining.", price: 3999, mrp: 6999, discount: 43, sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Black", "Brown", "Tan"], category: "Formal", gender: "Men", rating: 4.1, reviewCount: 1890, images: ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600"], stock: 80 },

    // ===== WOMEN'S SHOES =====
    { id: 21, brand: "Nike", name: "Air Zoom Pegasus 40", description: "Versatile daily running shoe with responsive Zoom Air cushioning and breathable mesh upper.", price: 4495, mrp: 7995, discount: 44, sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Pink", "White", "Black"], category: "Running", gender: "Women", rating: 4.5, reviewCount: 5340, images: ["https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600"], stock: 75 },
    { id: 22, brand: "Adidas", name: "NMD_R1 W", description: "Street-style icon with Boost cushioning and Primeknit upper. From the streets to the studio.", price: 4999, mrp: 9999, discount: 50, sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Core Black", "Cloud White", "Pink"], category: "Sneakers", gender: "Women", rating: 4.4, reviewCount: 4280, images: ["https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600"], stock: 68 },
    { id: 23, brand: "Converse", name: "Chuck 70 Hi", description: "Premium version of the classic with heavier canvas, vintage details, and cushioned insole.", price: 3499, mrp: 6499, discount: 46, sizes: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Parchment", "Black", "Egret"], category: "Casual", gender: "Women", rating: 4.3, reviewCount: 6750, images: ["https://images.unsplash.com/photo-1494496195158-c3becb4f2475?w=600"], stock: 120 },
    { id: 24, brand: "Vans", name: "Sk8-Hi Platform", description: "Stacked platform version of the legendary high-top with canvas and suede upper.", price: 3799, mrp: 6999, discount: 46, sizes: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Black", "White", "Checkerboard"], category: "Casual", gender: "Women", rating: 4.2, reviewCount: 3450, images: ["https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600"], stock: 95 },
    { id: 25, brand: "New Balance", name: "327 Retro", description: "Retro-inspired lifestyle sneaker with oversized N logo and asymmetric design.", price: 3999, mrp: 7499, discount: 47, sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Sea Salt", "Moonbeam", "Timberwolf"], category: "Sneakers", gender: "Women", rating: 4.5, reviewCount: 5670, images: ["https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600"], stock: 85 },
    { id: 26, brand: "Steve Madden", name: "Maxima Platform Sneaker", description: "Bold chunky platform sneaker with textured upper and exaggerated sole for street cred.", price: 4999, mrp: 8999, discount: 44, sizes: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["White", "Black", "Blush"], category: "Sneakers", gender: "Women", rating: 4.1, reviewCount: 2340, images: ["https://images.unsplash.com/photo-1581101767113-1677fc2beaa8?w=600"], stock: 55 },
    { id: 27, brand: "Dr. Martens", name: "1460 Pascal Women's", description: "Softer Virginia leather version of the iconic 8-eye boot with air-cushioned sole.", price: 7999, mrp: 13999, discount: 43, sizes: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Black", "Cherry Red", "Optical White"], category: "Boots", gender: "Women", rating: 4.6, reviewCount: 4890, images: ["https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600"], stock: 45 },
    { id: 28, brand: "Nike", name: "Air Max 90", description: "The '90s icon with visible Air unit and classic waffle outsole. Style that never fades.", price: 4995, mrp: 8995, discount: 44, sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["White", "Pink", "Grey"], category: "Sneakers", gender: "Women", rating: 4.5, reviewCount: 7890, images: ["https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600"], stock: 70 },
    { id: 29, brand: "Reebok", name: "Club C 85 Women's", description: "Clean court classic with soft leather upper, terry cloth lining, and lightweight cushioning.", price: 2999, mrp: 5499, discount: 45, sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["White", "Chalk", "Pink"], category: "Casual", gender: "Women", rating: 4.3, reviewCount: 3560, images: ["https://images.unsplash.com/photo-1595461135849-c308b9b7e9f0?w=600"], stock: 100 },
    { id: 30, brand: "ASICS", name: "Gel-Nimbus 25 W", description: "Premium cushioned running shoe with PureGEL tech and FF BLAST PLUS midsole.", price: 5999, mrp: 10999, discount: 45, sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Black", "Lavender", "Blue"], category: "Running", gender: "Women", rating: 4.6, reviewCount: 2980, images: ["https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600"], stock: 50 },
    { id: 31, brand: "Birkenstock", name: "Arizona Big Buckle", description: "Iconic two-strap sandal with contoured cork footbed and oversized metal buckles.", price: 4499, mrp: 7999, discount: 44, sizes: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Black", "Cognac", "White"], category: "Casual", gender: "Women", rating: 4.4, reviewCount: 8920, images: ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600"], stock: 115 },
    { id: 32, brand: "UGG", name: "Classic Mini II", description: "Cozy twin-face sheepskin boot with Treadlite sole for lightweight comfort and traction.", price: 6999, mrp: 11999, discount: 42, sizes: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Chestnut", "Black", "Grey"], category: "Boots", gender: "Women", rating: 4.5, reviewCount: 10200, images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600"], stock: 60 },
    { id: 33, brand: "Skechers", name: "D'Lites Fresh Start", description: "Chunky dad sneaker with air-cooled memory foam and lightweight shock-absorbing midsole.", price: 2799, mrp: 4999, discount: 44, sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["White/Navy", "Black", "Grey/Pink"], category: "Casual", gender: "Women", rating: 4.1, reviewCount: 5430, images: ["https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600"], stock: 130 },
    { id: 34, brand: "Puma", name: "Cali Dream", description: "California-inspired platform sneaker with leather upper and stacked rubber outsole.", price: 3299, mrp: 5999, discount: 45, sizes: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["White", "Pink", "Black"], category: "Sneakers", gender: "Women", rating: 4.3, reviewCount: 3780, images: ["https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600"], stock: 90 },
    { id: 35, brand: "Adidas", name: "Superstar W", description: "The shell-toe legend returns. Full-grain leather upper with the unmistakable rubber shell toe.", price: 3499, mrp: 6999, discount: 50, sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["White/Black", "White/Gold", "All White"], category: "Sneakers", gender: "Women", rating: 4.6, reviewCount: 13400, images: ["https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=600"], stock: 170 },
    { id: 36, brand: "Jimmy Choo", name: "Romy 100 Pump", description: "Elegant pointed-toe pump in patent leather with a slim 100mm heel. Red carpet ready.", price: 14999, mrp: 24999, discount: 40, sizes: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7"], colors: ["Nude", "Black", "Red"], category: "Formal", gender: "Women", rating: 4.7, reviewCount: 1240, images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600"], stock: 15 },
    { id: 37, brand: "Sam Edelman", name: "Loraine Bit Loafer", description: "Classic horsebit loafer in supple leather with padded footbed and low stacked heel.", price: 5999, mrp: 9999, discount: 40, sizes: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Black Leather", "Saddle", "Ivory"], category: "Formal", gender: "Women", rating: 4.4, reviewCount: 2890, images: ["https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=600"], stock: 45 },
    { id: 38, brand: "Brooks", name: "Ghost 15 W", description: "Smooth transitions running shoe with DNA LOFT cushioning from heel to toe.", price: 4799, mrp: 8499, discount: 44, sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Peacoat", "Black", "Lavender"], category: "Running", gender: "Women", rating: 4.5, reviewCount: 4510, images: ["https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600"], stock: 58 },
    { id: 39, brand: "Nike", name: "Dunk Low", description: "From the court to the street. Clean colorblocking with premium leather and classic styling.", price: 4995, mrp: 8495, discount: 41, sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Panda", "Rose Whisper", "University Blue"], category: "Sneakers", gender: "Women", rating: 4.7, reviewCount: 9230, images: ["https://images.unsplash.com/photo-1612681621985-f9e570fe39e0?w=600"], stock: 35 },
    { id: 40, brand: "Fila", name: "Disruptor II", description: "The chunky sneaker that started the trend. Leather upper with oversized sole and Fila branding.", price: 2499, mrp: 4499, discount: 44, sizes: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["White", "Pink", "Black"], category: "Sneakers", gender: "Women", rating: 4.0, reviewCount: 7890, images: ["https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600"], stock: 105 },
    { id: 41, brand: "Jordan", name: "Air Jordan 1 Mid SE W", description: "Women's exclusive colorway of the legendary AJ1 Mid with premium materials.", price: 6999, mrp: 11999, discount: 42, sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Arctic Orange", "Barely Rose", "Black"], category: "Sneakers", gender: "Women", rating: 4.6, reviewCount: 4560, images: ["https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600"], stock: 28 },
    { id: 42, brand: "Timberland", name: "Nellie Chukka Boot", description: "Women's waterproof chukka boot with premium nubuck leather and padded collar.", price: 5999, mrp: 9999, discount: 40, sizes: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Wheat", "Black", "Dark Brown"], category: "Boots", gender: "Women", rating: 4.3, reviewCount: 3210, images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600"], stock: 50 },
];

// ---------- Sorting Strategies (Strategy Pattern) ----------
const SORT_STRATEGIES = {
    'price-low': (a, b) => a.price - b.price,
    'price-high': (a, b) => b.price - a.price,
    'rating': (a, b) => b.rating - a.rating,
    'discount': (a, b) => b.discount - a.discount,
    'newest': (a, b) => b.id - a.id
};

// ---------- DBService Class ----------
class DBService {
    constructor(products) {
        this._products = products;
    }

    /** Initialize database */
    async init() { return true; }

    /** Search + filter + sort products */
    async fetchProducts(query = '', filters = {}) {
        let results = [...this._products];

        // Text search
        if (query) {
            const q = query.toLowerCase();
            results = results.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }

        // Apply filters
        results = this._applyFilters(results, filters);

        // Sort
        const sorter = SORT_STRATEGIES[filters.sort];
        if (sorter) results.sort(sorter);

        return results;
    }

    /** Apply all filters to results */
    _applyFilters(results, filters) {
        if (filters.gender && filters.gender !== 'All')
            results = results.filter(p => p.gender === filters.gender);
        if (filters.category)
            results = results.filter(p => p.category === filters.category);
        if (filters.minPrice !== undefined)
            results = results.filter(p => p.price >= filters.minPrice);
        if (filters.maxPrice !== undefined)
            results = results.filter(p => p.price <= filters.maxPrice);
        if (filters.size)
            results = results.filter(p => p.sizes.includes(filters.size));
        if (filters.color)
            results = results.filter(p => p.colors.some(c => c.toLowerCase().includes(filters.color.toLowerCase())));
        if (filters.brand)
            results = results.filter(p => p.brand === filters.brand);
        if (filters.minRating)
            results = results.filter(p => p.rating >= filters.minRating);
        return results;
    }

    /** Get single product by ID */
    async getProductById(id) {
        return this._products.find(p => p.id === id) || null;
    }

    /** Get top-rated products */
    async getTrendingProducts() {
        return [...this._products].sort((a, b) => b.rating - a.rating).slice(0, 8);
    }

    /** Get all unique brands */
    getAllBrands() {
        return [...new Set(this._products.map(p => p.brand))].sort();
    }

    /** Get all unique categories */
    getAllCategories() {
        return [...new Set(this._products.map(p => p.category))].sort();
    }

    /** Get min/max price range */
    getPriceRange() {
        const prices = this._products.map(p => p.price);
        return { min: Math.min(...prices), max: Math.max(...prices) };
    }
}

// Singleton
const dbService = new DBService(PRODUCTS);
export default dbService;

// Named exports for backward compatibility
export const initDB = () => dbService.init();
export const fetchProducts = (q, f) => dbService.fetchProducts(q, f);
export const getProductById = (id) => dbService.getProductById(id);
export const getTrendingProducts = () => dbService.getTrendingProducts();
export const getAllBrands = () => dbService.getAllBrands();
export const getAllCategories = () => dbService.getAllCategories();
export const getPriceRange = () => dbService.getPriceRange();
