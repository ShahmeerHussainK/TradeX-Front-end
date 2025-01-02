import TableContainer from "@/components/TableContainer";
import { Input } from "@/components/ui/input";
import {  useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
import { getUsers } from "@/api/users";
import toast from "react-hot-toast";

export default function AllBettors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [bettorsList, setBettorsList] = useState([]);
  const [setSearchParams] = useSearchParams();

  

  const handleSearchedData=(currentSearch)=> {
    const searchedList = bettorsList.filter((row) =>{
      return (
        row.bettor.toLowerCase().includes(currentSearch.toLowerCase()) || 
        row.email.toLowerCase().includes(currentSearch.toLowerCase())
      )
    })
    setSearchedData(searchedList);
  }

  function handleSearchChange(e) {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if(newSearchTerm){
      handleSearchedData(newSearchTerm)
      setSearchParams({ search: newSearchTerm, page: "1" });
    } else{
      setSearchedData([])
    }
  }

  function handleKeyPressEvent(event) {
    if (event.key === "Enter") {
      handleSearchedData(searchTerm);
    }
  }
  const getUsersData = async()=>{
    try{
      const list = await getUsers()
      setBettorsList(list)
    }
    catch(err){
        toast.error('error occured',err)
    }
  }

  useEffect(()=>{
    getUsersData()
  },[])

  return (
    <div className="space-y-10 px-6 py-12">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-700">All Bettors</h3>
        <div className="relative flex h-11 w-3/12 pr-4">
          <Input
            type="text"
            placeholder="Username/Email"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPressEvent}
            className="h-full min-w-full border-none bg-gray-100 outline-none ring-1 ring-gray-300 transition duration-300 focus:shadow-[0_0_15px_rgba(99,102,241,0.6)] focus:outline-none focus:ring-0 focus:ring-indigo-600"
          />
          <IoIosSearch
            className="absolute right-4 h-full w-12 rounded-r-md bg-indigo-600 p-2 text-3xl text-white"
            onClick={() => handleSearchedData(searchTerm)}
          />
        </div>
      </div>
      <div className="bg-white">
        <TableContainer
          data={searchTerm? searchedData: bettorsList}
          rowsPerPage={15}
        />
      </div>
    </div>
  );
}
