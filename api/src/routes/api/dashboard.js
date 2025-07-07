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
                            { $match: { $eq: ["$status", "completed"] } },
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
        const groupBy = { _id: null, totalRevenue: { $sum: "$totalPrice" } };

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
        }
        else if (period === "month") {
            match.createdAt = {
                $gte: new Date(new Date().setDate(1)),
                $lt: new Date(new Date().setMonth(new Date().getMonth() + 1, 1))
            };
            groupBy._id = { $month: "$createdAt" };
        }

        if (type === "orders") {
            groupBy.totalOrders = { $sum: 1 };
            delete groupBy.totalRevenue;
        }
        else if (type === "revenue") {
            groupBy.totalRevenue = { $sum: "$totalPrice" };
            delete groupBy.totalOrders;
        }

        // 2) esegui l’aggregate
        const rawData = await Orders.aggregate([
            { $match: match },
            { $group: groupBy },
            { $sort: { _id: 1 } }
        ]);

        // 3) arricchisci con la label
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const salesData = rawData.map(item => {
            let label;
            if (period === "day") {
                // item._id è un numero 1–31
                label = item._id.toString();
            } else if (period === "week") {
                // 1-4 in base alla settimana nel mese
                label = `Week ${item._id}`;
            } else if (period === "month") {
                // item._id: 1–12
                label = monthNames[item._id - 1];
            }
            return { ...item, label };
        });

        // 4) invia
        res.send({ status: "success", salesData });
    } catch (err) {
        next(err);
    }
});


module.exports = router;