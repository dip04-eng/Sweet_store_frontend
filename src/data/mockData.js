export const mockSweets = [
  {
    id: 1,
    name: "Gulab Jamun",
    price: 100,
    unit: "kg",
    image: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
    stock: 50,
    description: "Soft, spongy milk dumplings in rose-scented syrup"
  },
  {
    id: 2,
    name: "Rasgulla",
    price: 380,
    unit: "kg",
    image: "https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg",
    stock: 30,
    description: "Spongy cottage cheese balls in light sugar syrup"
  },
  {
    id: 3,
    name: "Kaju Katli",
    price: 800,
    unit: "kg",
    image: "https://images.pexels.com/photos/6659564/pexels-photo-6659564.jpeg",
    stock: 25,
    description: "Diamond-shaped cashew fudge with silver leaf"
  },
  {
    id: 4,
    name: "Jalebi",
    price: 320,
    unit: "kg",
    image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
    stock: 40,
    description: "Crispy spiral-shaped sweets soaked in sugar syrup"
  },
  {
    id: 5,
    name: "Laddu",
    price: 400,
    unit: "piece",
    image: "https://images.pexels.com/photos/6424400/pexels-photo-6424400.jpeg",
    stock: 35,
    description: "Round sweet balls made with gram flour and ghee"
  },
  {
    id: 6,
    name: "Barfi",
    price: 500,
    unit: "kg",
    image: "https://images.pexels.com/photos/6659568/pexels-photo-6659568.jpeg",
    stock: 20,
    description: "Rich milk-based sweet with nuts and cardamom"
  },
  {
    id: 7,
    name: "Paratha",
    price: 10,
    unit: "piece",
    image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
    stock: 100,
    description: "Crispy and flaky Indian flatbread"
  }
];

export const mockOrders = [
  {
    id: 1,
    customerName: "Priya Sharma",
    mobile: "9876543210",
    address: "123 MG Road, Bangalore",
    orderDate: "2025-01-15",
    deliveryDate: "2025-01-17",
    preference: "Extra sweet",
    items: [
      { sweetId: 1, sweetName: "Gulab Jamun", quantity: 2, price: 450 },
      { sweetId: 3, sweetName: "Kaju Katli", quantity: 1, price: 800 }
    ],
    total: 1700,
    status: "pending"
  },
  {
    id: 2,
    customerName: "Rajesh Kumar",
    mobile: "8765432109",
    address: "456 Park Street, Delhi",
    orderDate: "2025-01-15",
    deliveryDate: "2025-01-18",
    preference: "",
    items: [
      { sweetId: 2, sweetName: "Rasgulla", quantity: 3, price: 380 },
      { sweetId: 4, sweetName: "Jalebi", quantity: 2, price: 320 }
    ],
    total: 1780,
    status: "delivered"
  },
  {
    id: 3,
    customerName: "Anita Patel",
    mobile: "7654321098",
    address: "789 Commercial Street, Mumbai",
    orderDate: "2025-01-14",
    deliveryDate: "2025-01-16",
    preference: "Less oil",
    items: [
      { sweetId: 5, sweetName: "Laddu", quantity: 2, price: 400 },
      { sweetId: 6, sweetName: "Barfi", quantity: 1, price: 500 }
    ],
    total: 1300,
    status: "processing"
  }
];