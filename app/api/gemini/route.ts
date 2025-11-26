import { NextRequest, NextResponse } from "next/server";
import { generateRecipe } from "../../../lib/generate";

export async function POST(req: NextRequest) {
  try {
    const { ingredients } = await req.json();

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error("Ingredients must be a non-empty array");
    }
    const response = await generateRecipe(ingredients);

    return Response.json({
      success: true,
      result: response,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
