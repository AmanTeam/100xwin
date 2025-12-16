import React from 'react'

const GameHistory = ({history}) => {
  return (
    <div className="m-2 p-2 bg-blue-300 font-semibold rounded">
    {/* <h2 className="text-xl mb-2">Game History</h2> */}
   <table className="table-auto border-collapse border border-gray-300">
   <thead>
<tr className=' bg-orange-300'>
<th className="border border-gray-300 p-2  w-[15%] text-left">Game ID</th>
<th className="border border-gray-300 p-2 w-[10%] text-center">Number</th>
<th className="border border-gray-300 p-2 w-[20%] text-left">Color</th>
<th className="border border-gray-300 p-2 w-[20%] text-left">Big Small</th>
</tr>
</thead>
<tbody>
{history.slice(-10).reverse().map((item, index) => (
<tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-orange-200"}>
<td className="border border-gray-300 p-2 text-left">{item.Id}</td>
<td className="border border-gray-300 p-2 text-center">{item.number}</td>
<td className="border border-gray-300 p-2 flex justify-center items-center">{ <span className={` p-3 mx-auto rounded ${item.color === "Red" ? " bg-red-600" : item.color === "Green" ? "bg-green-500" : " bg-violet-500"} `}> </span>}</td>

<td className="border border-gray-300 p-2 text-left">{item.BigSmall}</td>
</tr>
))}
</tbody>
</table>
</div>
  )
}

export default GameHistory
