const router = require("express").Router();
const { authStrict } = require("@middleware/authMiddleware");
const Restaurants = require("@models/Users.Restaurants");
const Menus = require("@models/Restaurants/Restaurants.Menus");
const Meals = require("@models/Restaurants/Restaurants.Meals");
const Orders = require("@models/Restaurants/Restaurants.Orders");
const { validate } = require("@middleware/validationMiddleware");
const validator = require("@validators/dashboardValidator");

router.get("/orders/get", authStrict, async (req, res, next) => {
    try {
        const restaurant = await Restaurants.findOne({ user: req.user._id }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        const todayOrdersCount = await Orders.countDocuments({
            restaurant: restaurant._id,
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            },
            status: { $ne: "canceled" }
        });

        const monthOrdersCount = await Orders.countDocuments({
            restaurant: restaurant._id,
            createdAt: {
                $gte: new Date(new Date().setDate(1)),
                $lt: new Date(new Date().setMonth(new Date().getMonth() + 1, 1))
            },
            status: { $ne: "canceled" }
        });

        const previousMonthOrdersCount = await Orders.countDocuments({
            restaurant: restaurant._id,
            createdAt: {
                $gte: new Date(new Date().setMonth(new Date().getMonth() - 1, 1)),
                $lt: new Date(new Date().setDate(1))
            },
            status: { $ne: "canceled" }
        });

        const totalOrdersCount = await Orders.countDocuments({ restaurant: restaurant._id, status: { $ne: "canceled" } });

        const weekOrdersCount = await Orders.countDocuments({
            restaurant: restaurant._id,
            createdAt: {
                $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                $lt: new Date()
            },
            status: { $ne: "canceled" }
        });

        const monthlyOrdersAverage = await Orders.aggregate([
            {
                $match: {
                    restaurant: restaurant._id,
                    createdAt: {
                        $gte: new Date(new Date().setDate(1)),
                        $lt: new Date(new Date().setMonth(new Date().getMonth() + 1, 1))
                    },
                    status: { $ne: "canceled" }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalOrders: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    averageOrders: { $avg: "$totalOrders" }
                }
            }
        ]);

        const previousWeekOrdersCount = await Orders.aggregate([
            {
                $match: {
                    restaurant: restaurant._id,
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 14)),
                        $lt: new Date(new Date().setDate(new Date().getDate() - 7))
                    },
                    status: { $ne: "canceled" }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        res.send({
            status: "success",
            orders: {
                today: todayOrdersCount,
                month: monthOrdersCount,
                previousMonth: previousMonthOrdersCount,
                week: weekOrdersCount,
                previousWeek: previousWeekOrdersCount.length > 0 ? previousWeekOrdersCount[0].totalOrders : 0,
                total: totalOrdersCount,
                monthlyAverage: monthlyOrdersAverage.length > 0 ? monthlyOrdersAverage[0].averageOrders : 0
            }
        });
    } catch (err) { next(err); }
});

router.get("/revenue/get", authStrict, async (req, res, next) => {
    try {
        const restaurant = await Restaurants.findOne({ user: req.user._id }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        const todayRevenue = await Orders.aggregate([
            {
                $match: {
                    restaurant: restaurant._id,
                    createdAt: {
                        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        $lt: new Date(new Date().setHours(23, 59, 59, 999))
                    },
                    status: "completed"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const monthRevenue = await Orders.aggregate([
            {
                $match: {
                    restaurant: restaurant._id,
                    createdAt: {
                        $gte: new Date(new Date().setDate(1)),
                        $lt: new Date(new Date().setMonth(new Date().getMonth() + 1, 1))
                    },
                    status: "completed"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const previousMonthRevenue = await Orders.aggregate([
            {
                $match: {
                    restaurant: restaurant._id,
                    createdAt: {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1, 1)),
                        $lt: new Date(new Date().setDate(1))
                    },
                    status: "completed"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const weekRevenue = await Orders.aggregate([
            {
                $match: {
                    restaurant: restaurant._id,
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                        $lt: new Date()
                    },
                    status: "completed"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const totalRevenue = await Orders.aggregate([
            {
                $match: { restaurant: restaurant._id, status: "completed" }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const averageTotalPrice = await Orders.aggregate([
            {
                $match: { restaurant: restaurant._id, status: "completed" }
            },
            {
                $group: {
                    _id: null,
                    averageTotalPrice: { $avg: "$totalPrice" }
                }
            }
        ]);

        const previousWeekRevenue = await Orders.aggregate([
            {
                $match: {
                    restaurant: restaurant._id,
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 14)),
                        $lt: new Date(new Date().setDate(new Date().getDate() - 7))
                    },
                    status: "completed"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        res.send({
            status: "success",
            revenue: {
                today: todayRevenue.length > 0 ? todayRevenue[0].totalRevenue : 0,
                month: monthRevenue.length > 0 ? monthRevenue[0].totalRevenue : 0,
                previousMonth: previousMonthRevenue.length > 0 ? previousMonthRevenue[0].totalRevenue : 0,
                week: weekRevenue.length > 0 ? weekRevenue[0].totalRevenue : 0,
                previousWeek: previousWeekRevenue.length > 0 ? previousWeekRevenue[0].totalRevenue : 0,
                total: totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0,
                averageTotalPrice: averageTotalPrice.length > 0 ? averageTotalPrice[0].averageTotalPrice : 0
            }
        });
    } catch (err) { next(err); }
});

router.get("/products/get", authStrict, async (req, res, next) => {
    try {
        const { filter } = req.query;

        const restaurant = await Restaurants.findOne({ user: req.user._id }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        if (filter === "popular" || filter === "least") {
            // 1) prendi tutti i piatti con quantità venduta
            const mealsWithSales = await Meals.aggregate([
                { $match: { restaurant: restaurant._id } },
                {
                    $lookup: {
                        from: "Restaurants.Orders",
                        let: { mealId: "$_id", unitPrice: "$price" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$restaurant", restaurant._id] } } },
                            { $unwind: "$meals" },
                            { $match: { $expr: { $eq: ["$meals.meal", "$$mealId"] } } },
                            { $match: { $expr: { $eq: ["$status", "completed"] } } },
                            {
                                $project: {
                                    quantity: "$meals.quantity",
                                    lineRevenue: { $multiply: ["$meals.quantity", "$$unitPrice"] },
                                    createdAt: 1
                                }
                            }
                        ],
                        as: "orderItems"
                    }
                },
                {
                    $addFields: {
                        totalSold: { $sum: "$orderItems.quantity" }
                    }
                },
                // ordina in base al filtro
                {
                    $sort: filter === "popular"
                        ? { totalSold: -1 }
                        : { totalSold: 1 }
                },
                { $limit: 5 },
                {
                    $project: {
                        name: 1,
                        price: 1,
                        ingredients: 1,
                        orderItems: 1,
                        totalSold: 1
                    }
                }
            ]);

            // 2) ricava il revenue totale del ristorante
            const overallRevenueRes = await Orders.aggregate([
                { $match: { restaurant: restaurant._id } },
                { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
            ]);
            const overallRevenue = overallRevenueRes[0]?.totalRevenue || 0;

            // 3) calcola inizio mese corrente e scorso
            const now = new Date();
            const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

            // 4) arricchisci ogni piatto con revenue, % e trend
            const enriched = await Promise.all(
                mealsWithSales.map(async meal => {
                    // venduto questo mese
                    const [thisMonth] = await Orders.aggregate([
                        { $match: { restaurant: restaurant._id, createdAt: { $gte: startOfThisMonth } } },
                        { $unwind: "$meals" },
                        { $match: { "meals.meal": meal._id } },
                        { $group: { _id: null, qty: { $sum: "$meals.quantity" } } }
                    ]);
                    // venduto mese scorso
                    const [lastMonth] = await Orders.aggregate([
                        {
                            $match: {
                                restaurant: restaurant._id,
                                createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth }
                            }
                        },
                        { $unwind: "$meals" },
                        { $match: { "meals.meal": meal._id } },
                        { $group: { _id: null, qty: { $sum: "$meals.quantity" } } }
                    ]);

                    const qtyThis = thisMonth?.qty || 0;
                    const qtyLast = lastMonth?.qty || 0;
                    let trend = "even";
                    if (qtyThis > qtyLast) trend = "up";
                    else if (qtyThis < qtyLast) trend = "down";

                    // revenue del piatto
                    const revenue = meal.orderItems.reduce(
                        (sum, it) => sum + (it.lineRevenue || 0), 0
                    );

                    return {
                        _id: meal._id,
                        name: meal.name,
                        price: meal.price,
                        ingredients: meal.ingredients,
                        totalSold: meal.totalSold,
                        totalRevenue: revenue,
                        revenuePercent: overallRevenue
                            ? ((revenue / overallRevenue) * 100).toFixed(2)
                            : "0.00",
                        trend
                    };
                })
            );

            return res.send({ status: "success", meals: enriched });
        }

        // filtro non valido
        return res
            .status(400)
            .send({ status: "error", error: "Unknown filter" });
    } catch (err) {
        next(err);
    }
});

router.get("/orders/recent/get", authStrict, async (req, res, next) => {
    try {
        const restaurant = await Restaurants.findOne({ user: req.user._id }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        const recentOrders = await Orders.find({ restaurant: restaurant._id })
            .sort({ createdAt: -1, _id: -1 })
            .limit(5)
            .populate("user", "name surname")
            .lean();

        res.send({ status: "success", orders: recentOrders });
    } catch (err) { next(err); }
});

router.get("/salestrend/get", authStrict, async (req, res, next) => {
    try {
        const { error } = validator.salestrendSchema.validate(req.query);
        if (error)
            return res.status(400).send({ status: "error", error: error.details[0].message });

        const { period, type } = req.query;
        const restaurant = await Restaurants.findOne({ user: req.user._id }).lean();
        if (!restaurant)
            return res.status(404).send({ status: "error", error: "Restaurant not found" });

        // 1) costruisci match e groupBy
        const match = { restaurant: restaurant._id };
        if (type == "revenue") match.status = "completed";
        else if (type != "orders") match.status = { $ne: "canceled" };

        const groupBy = { _id: null, totalRevenue: { $sum: "$totalPrice" } };
        let allPeriods = [];

        if (period === "day") {
            // 1) match: dall’inizio del mese corrente fino al prossimo mese
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            match.createdAt = {
                $gte: startOfMonth,
                $lt: startOfNextMonth
            };

            // 2) groupBy: giorno del mese (1–31)
            groupBy._id = { $dayOfMonth: "$createdAt" };

            // 3) genera tutti i giorni del mese
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                allPeriods.push({
                    _id: day,
                    label: day.toString(),
                    totalRevenue: 0,
                    totalOrders: 0
                });
            }
        }
        else if (period === "week") {
            match.createdAt = {
                $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                $lt: new Date()
            };
            // calcola settimana del mese: giorno del mese / 7, arrotondato per eccesso
            groupBy._id = {
                $ceil: {
                    $divide: [
                        { $dayOfMonth: "$createdAt" },
                        7
                    ]
                }
            };

            // 3) genera tutte le settimane del mese (massimo 5)
            for (let week = 1; week <= 5; week++) {
                allPeriods.push({
                    _id: week,
                    label: `Week ${week}`,
                    totalRevenue: 0,
                    totalOrders: 0
                });
            }
        }
        else if (period === "month") {
            // Per i mesi, mostra gli ultimi 12 mesi
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
            const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            
            match.createdAt = {
                $gte: startDate,
                $lt: endDate
            };
            groupBy._id = { $month: "$createdAt" };

            // 3) genera tutti i mesi degli ultimi 12 mesi
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            
            for (let i = 0; i < 12; i++) {
                const monthDate = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
                const monthNumber = monthDate.getMonth() + 1;
                allPeriods.push({
                    _id: monthNumber,
                    label: monthNames[monthNumber - 1],
                    totalRevenue: 0,
                    totalOrders: 0
                });
            }
        }

        if (type === "orders") {
            groupBy.totalOrders = { $sum: 1 };
            delete groupBy.totalRevenue;
        }
        else if (type === "revenue") {
            groupBy.totalRevenue = { $sum: "$totalPrice" };
            delete groupBy.totalOrders;
        }

        // 2) esegui l'aggregate
        const rawData = await Orders.aggregate([
            { $match: match },
            { $group: groupBy },
            { $sort: { _id: 1 } }
        ]);

        // 3) merge dei dati reali con tutti i periodi
        const salesData = allPeriods.map(period => {
            const actualData = rawData.find(item => item._id === period._id);
            if (actualData) {
                return {
                    _id: period._id,
                    label: period.label,
                    totalRevenue: actualData.totalRevenue || 0,
                    totalOrders: actualData.totalOrders || 0
                };
            }
            return period;
        });

        // 4) invia
        res.send({ status: "success", salesData });
    } catch (err) {
        next(err);
    }
});


module.exports = router;