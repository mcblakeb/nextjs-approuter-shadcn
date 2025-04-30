'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Input } from '@/components/ui/input';
//import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
//import { createCategoryAction } from "@/actions/database";

const initialState = {
  message: 'None',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending}>
      Add
    </button>
  );
}

export default function CardCategory() {
  // const [state, formAction] = useActionState(
  //   createCategoryAction,
  //   initialState
  // );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Column</CardTitle>
      </CardHeader>
      <CardContent>
        {/* <form action={formAction} className="space-y-4">
          <div>
            <Label>Column Name</Label>
            <Input id="CategoryName" name="CategoryName" />
          </div>
           <div>
            <Label>Column Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select column type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="varchar(255)">Text (VARCHAR)</SelectItem>
                <SelectItem value="int">Integer (INT)</SelectItem>
                <SelectItem value="boolean">Boolean (BOOLEAN)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SubmitButton />
          <p role="status">{state?.message}</p>
        </form> */}
      </CardContent>
    </Card>
  );
}
