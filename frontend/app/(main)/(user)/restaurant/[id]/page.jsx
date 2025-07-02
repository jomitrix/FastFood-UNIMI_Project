export default async function RestaurantPage({ params }) {
    const { id } = params;
  
    return (
        <div className="w-full flex flex-col min-h-screen bg-[#f5f3f5]">
            <h1>Restaurant n°{id}</h1>
        </div>
    )
}
