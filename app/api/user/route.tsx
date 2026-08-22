import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export async function POST(){
    const user=await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
        console.log("User creation skipped: no authenticated email");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users=await db.select().from(usersTable).where(eq(usersTable.email, email))

if(users?.length===0){
    const data={
   name:user?.fullName??'',
    email,
    }
    const result=await db.insert(usersTable).values({...data}).returning();
    console.log("New user created:", result[0]);
    return NextResponse.json(result[0]??{})
}

console.log("User already exists:", users[0]);
return NextResponse.json(users[0]??{})


}