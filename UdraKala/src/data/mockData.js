
export const users = [
    {
        id: 1,
        fullName: "Admin User",
        email: "admin@udrakala.com",
        password: "password123",
        role: "ADMIN",
        phoneNumber: "9876543210"
    },
    {
        id: 2,
        fullName: "Ramesh Weaver",
        email: "seller@udrakala.com",
        password: "password123",
        role: "SELLER",
        shopName: "Odisha Weaves",
        gstNumber: "21AAAAA0000A1Z5",
        approved: true,
        phoneNumber: "9876543211"
    },
    {
        id: 3,
        fullName: "Anita Das",
        email: "customer@udrakala.com",
        password: "password123",
        role: "CUSTOMER",
        phoneNumber: "9876543212",
        address: "Bhubaneswar, Odisha"
    }
];

export const products = [
    {
        id: 101,
        name: "Sambalpuri Ikat Silk Saree",
        description: "Authentic handwoven Sambalpuri silk saree with traditional Pasapalli motifs. Finest silk from Western Odisha.",
        price: 15499,
        discountPrice: 12999,
        stockQuantity: 5,
        category: "Sarees",
        sellerId: 2,
        approved: true,
        imageUrls: ["https://img.freepik.com/free-photo/beautiful-indian-woman-wearing-sari_23-2149400847.jpg?w=740&t=st=1686259000~exp=1686259600~hmac=..."]
    },
    {
        id: 102,
        name: "Pattachitra Wall Hanging",
        description: "Intricate Pattachitra painting on palm leaf depicting Lord Jagannath's procession. Handcrafted by heritage artists.",
        price: 2499,
        stockQuantity: 15,
        category: "Home Decor",
        sellerId: 2,
        approved: true,
        imageUrls: ["https://img.freepik.com/free-photo/traditional-indian-art-displayed-shop_23-2149400890.jpg?w=740"]
    },
    {
        id: 103,
        name: "Dokra Brass Tribal Figurine",
        description: "Ancient lost-wax casting technique (Dokra) used to create this stunning tribal dance figurine.",
        price: 1850,
        stockQuantity: 8,
        category: "Handicrafts",
        sellerId: 2,
        approved: true,
        imageUrls: ["https://img.freepik.com/free-photo/close-up-antique-statue_23-2149400898.jpg?w=740"]
    },
    {
        id: 104,
        name: "Silver Filigree Earrings",
        description: "Exquisite Tarkasi (Silver Filigree) work from Cuttack. 925 Sterling Silver.",
        price: 3200,
        stockQuantity: 20,
        category: "Jewelry",
        sellerId: 2,
        approved: false,
        imageUrls: ["https://img.freepik.com/free-photo/indian-jewelry-set-necklaces_23-2149400902.jpg?w=740"]
    }
];

export const orders = [
    {
        id: 5001,
        userId: 3,
        items: [
            { productId: 101, quantity: 1, price: 15499 }
        ],
        totalAmount: 15499,
        status: "DELIVERED",
        createdAt: "2023-10-15T10:30:00Z"
    },
    {
        id: 5002,
        userId: 3,
        items: [
            { productId: 102, quantity: 2, price: 2499 }
        ],
        totalAmount: 4998,
        status: "PENDING",
        createdAt: "2023-12-09T14:20:00Z"
    }
];

export const stats = {
    users: 150,
    products: 85,
    orders: 432,
    revenue: 1250000
};
