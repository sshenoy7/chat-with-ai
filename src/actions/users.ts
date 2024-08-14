"use server"

import { connectMongoDB } from "@/config/database";
import UserModel from "@/models/user-model";
import { currentUser } from "@clerk/nextjs/server"

connectMongoDB();

export const saveAndGetLoggedInUser = async () => {
    try {
        const user = await currentUser();

        const existingUser = await UserModel.findOne({
            clerkUserId: user?.id,
        });

        if (existingUser) {
            console.log(existingUser);
            console.log("existing user")
            return {
                success: true,
                data: JSON.parse(JSON.stringify(existingUser)),
            }
        }
        const userObj = {
            name: user?.firstName! + user?.lastName,
            email: user?.emailAddresses[0].emailAddress,
            clerkUserId: user?.id
        }

        const newUser = await UserModel.create(userObj);
        return {
            success: true,
            data: JSON.parse(JSON.stringify(newUser)),
        }

    } catch (error) {
        return {
            message: "Unable to fetch the user details",
            success: false
        }
    }
}