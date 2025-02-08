"use client";

import { use } from "react-dom";
import { useFormStatus } from "react-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState = {
  message: null,
};

const createTodo = async (data: any) => {
  console.log(data);
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} className="w-full">
      Add
    </Button>
  );
}

export default function AddColumnForm() {
  const [state, formAction] = useActionState(createTodo, initialState);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Column</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <Label>Column Name</Label>
            <Input />
          </div>
          <div>
            <Label>Columsn Type</Label>
            <Select onValueChange={(value: string) => console.log(value)}>
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
        </form>
      </CardContent>
    </Card>
  );
}
