import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Decimal from 'decimal.js'

// GET method (existing code)
export async function GET(request: NextRequest) {
  try {
    const fetchedProducts = await prisma.products.findMany({
      where: {
        is_active: true
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        image_url: true
      }
    });

    if (!fetchedProducts || fetchedProducts.length === 0) {
      return NextResponse.json(
        { message: 'No products found' },
        { status: 404 }
      )
    }

    return NextResponse.json(fetchedProducts);
  } catch (error) {
    console.error('Detailed server error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: typeof error
    });

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error.message || 'Unknown error occurred',
        type: error.constructor.name
      },
      { status: 500 }
    );
  }
}

// POST method for creating a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const { name, price, description, image_url } = body;
    
    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const newProduct = await prisma.products.create({
      data: {
        name,
        price: new Decimal(price),
        description: description || null,
        image_url: image_url || null,
        is_active: true
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// PUT method for updating a product



export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const { id, name, price, description, image_url, is_active } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Ensure price is converted to Decimal
    const priceDecimal = price ? Number(price) : undefined;
    const updatedProduct = await prisma.products.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(priceDecimal && { price: priceDecimal }),
        ...(description !== undefined && { description }),
        ...(image_url !== undefined && { image_url }),
        ...(is_active !== undefined && { is_active })
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Detailed update error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: typeof error
    });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// DELETE method for deleting a product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await prisma.products.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Product successfully deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}