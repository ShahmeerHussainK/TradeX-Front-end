import CustomizeableButton from "@/components/CustomizeableButton";
import GamesContainerTable from "@/components/GamesContainerTable";
import { CiFilter } from "react-icons/ci";
import { useEffect, useState } from "react";
import { getMatches } from "@/api/matches";
import toast from "react-hot-toast";

export default function AllGames() {
  const [matches,setMatches]= useState([])
  const handleGetMatches = async()=>{
    try{
      const list = await getMatches()
      if(list)setMatches(list)
    }
    catch(err){
        toast.error('error occured', err)
    }
  }

  useEffect(()=>{
    handleGetMatches()
  },[])
  
  return (
    <div className="space-y-8 p-10 px-12">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold text-gray-600">All Games</h3>
        <div className="flex gap-3">
          <CustomizeableButton
            icon={<CiFilter />}
            label="Filter"
            onClick={() => console.log("Data Filtered")}
          />
        </div>
      </div>

      <div className="bg-white">
        <GamesContainerTable data={matches??[]} rowsPerPage={10} />
      </div>
    </div>
  );
}
