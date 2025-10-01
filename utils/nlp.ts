export async function analyzeText(
    text: string,
    parent_email?: string,
    parent_token?: string
) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze-text/`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
            parent_email: parent_email || undefined,
            parent_token: parent_token || undefined,
        }),
    });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
}
