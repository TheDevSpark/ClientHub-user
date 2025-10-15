"use client";
import { supabase } from "@/lib/supabaseClient";
import { Plus } from "lucide-react";
import React, { use, useEffect, useState } from "react";

function page({ params }) {
  const { id } = use(params);
  const [docs, setDocs] = useState([]);
  const [details, setDetails] = useState([]);
  const getCaseDocs = async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("case_id", id);
    setDocs(data);
  };
  const getDetails = async () => {
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .eq("case_id", id);
    console.log(data);
  };
  useEffect(() => {
    getCaseDocs();
    getDetails();
  }, []);
  if (docs.length <= 0) {
    return (
      <div className="w-screen h-screen justify-center items-center flex flex-col">
        <div className="bg-gray-300 p-4 rounded-full">
          <Plus />
        </div>
        <h1 className="font-bold py-2">No Docs Found Create One!</h1>
      </div>
    );
  }
  return <div></div>;
}

export default page;
