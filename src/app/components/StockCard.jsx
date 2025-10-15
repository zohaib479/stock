export default function StockCard({ stock }) {
  const changeColor = stock.change.includes("-") ? "text-red-400" : "text-green-400";

  return (
    <div className="bg-gray-700 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-200">
      <h4 className="text-lg font-bold">{stock.symbol}</h4>
      <p className="text-gray-300">{stock.name}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xl font-semibold">${stock.price}</p>
        <p className={`${changeColor} text-sm`}>{stock.change}</p>
      </div>
    </div>
  );
}
