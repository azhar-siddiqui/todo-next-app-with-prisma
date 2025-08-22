"use client";

import AddTask from "@/components/common/addTask";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Trigger = () => {
  const [open, setOpen] = useState(false);

  function handleDialog() {
    setOpen(!open);
  }
  return (
    <>
      <Button onClick={handleDialog}>Create New Task</Button>
      <AddTask open={open} setOpen={handleDialog} />
    </>
  );
};
