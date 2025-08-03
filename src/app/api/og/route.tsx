import { ImageResponse } from "next/og";
import { trpc } from "@/trpc/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  // Default OG image
  if (!productId) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            color: "white",
            background: "rgb(24, 24, 24)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 80, marginBottom: 20 }}>🚀</div>
          <div style={{ fontWeight: "bold" }}>Prodfind</div>
          <div style={{ fontSize: 32, marginTop: 10, opacity: 0.8 }}>
            Discover Amazing Products
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  }

  // Product-specific OG image
  try {
    const product = await trpc.getProduct({ productId });

    if (!product) {
      throw new Error("Product not found");
    }

    const images = product.images as any;
    const firstImage =
      Array.isArray(images) && images.length > 0 ? images[0].url : null;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: "rgb(24, 24, 24)",
            padding: 60,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              background: "rgb(32, 32, 32)",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            {/* Left side - Product info */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: 60,
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <h1
                  style={{
                    fontSize: 56,
                    fontWeight: "bold",
                    color: "white",
                    marginBottom: 20,
                    lineHeight: 1.2,
                  }}
                >
                  {product.name}
                </h1>
                <p
                  style={{
                    fontSize: 28,
                    color: "white",
                    lineHeight: 1.5,
                  }}
                >
                  {product.shortDescription}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: "bold",
                    color: "#667eea",
                  }}
                >
                  {product.price}
                </div>
                {product.category &&
                  Array.isArray(product.category) &&
                  product.category.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                      }}
                    >
                      {product.category.slice(0, 2).map((cat, i) => (
                        <div
                          key={i}
                          style={{
                            background: "#e9d8fd",
                            color: "#553c9a",
                            padding: "8px 16px",
                            borderRadius: 20,
                            fontSize: 20,
                          }}
                        >
                          {cat as string}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {/* Right side - Product image or icon */}
            <div
              style={{
                width: 400,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f7fafc",
              }}
            >
              {firstImage ? (
                <img
                  src={firstImage}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : product.icon ? (
                <div style={{ fontSize: 200 }}>{product.icon}</div>
              ) : (
                <div
                  style={{
                    fontSize: 200,
                    color: "#cbd5e0",
                  }}
                >
                  📦
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    // Fallback OG image on error
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            color: "white",
            background: "rgb(24, 24, 24)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 80, marginBottom: 20 }}>🚀</div>
          <div style={{ fontWeight: "bold" }}>Prodfind</div>
          <div style={{ fontSize: 32, marginTop: 10, opacity: 0.8 }}>
            Product Not Found
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  }
}
