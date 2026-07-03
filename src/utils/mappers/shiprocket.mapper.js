export const mapShippingEstimate = (response) => {
    const {
        available_courier_companies,
        recommended_courier_company_id,
    } = response.data;

    const couriers = available_courier_companies.map((courier) => ({
        id: courier.courier_company_id,
        name: courier.courier_name,
        rate: Number(courier.rate.toFixed(2)),
        estimatedDays: Number(courier.estimated_delivery_days),
        eta: courier.etd,
        rating: courier.rating,
        isSurface: courier.is_surface,
        codAvailable: Boolean(courier.cod),
        recommended:
            courier.courier_company_id ===
            recommended_courier_company_id,
    }));

    // Sort by shipping price
    couriers.sort((a, b) => a.rate - b.rate);

    // Summary for frontend
    const summary = {
        totalCouriers: couriers.length,
        lowestRate: couriers[0]?.rate ?? null,
        highestRate: couriers[couriers.length - 1]?.rate ?? null,
    };

    return {
        summary,
        recommendedCourier:
            couriers.find((courier) => courier.recommended) || null,
        couriers,
    };
};


// export const mapShippingEstimate = (response) => {
//     const recommendedId = response.data.recommended_courier_company_id;

//     const couriers = response.data.available_courier_companies.map(
//         (courier) => ({
//             id: courier.courier_company_id,
//             name: courier.courier_name,
//             rate: courier.rate,
//             estimatedDays: Number(courier.estimated_delivery_days),
//             eta: courier.etd,
//             rating: courier.rating,
//             isSurface: courier.is_surface,
//             codAvailable: Boolean(courier.cod),
//             recommended:
//                 courier.courier_company_id === recommendedId,
//         })
//     );

//     return {
//         recommendedCourier:
//             couriers.find((courier) => courier.recommended) || null,

//         couriers,
//     };
// };