type Color = {
    hex: string
};

function encodeQuery(params: Record<string, string>) {
    const p = Object.entries(params)
        .filter( ([key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
    return !p.length ? p : `?${p}`;
}

/**
 * @see https://www.colourlovers.com/api
 */
export default function useColors() {

    async function getColors(term?: string) {
        const allParams = {
            format: 'json',
            keywords: term ? term.trim() : undefined,
            numResults: 5
        };

        const response = await fetch(`https://www.colourlovers.com/api/colors${encodeQuery(allParams)}`, {
            mode: 'no-cors'
        });
        if (!response.ok) {
            console.error(response);
            throw new Error('Getting color went wrong')
        }
        const colors: Color[] = await response.json();
        return colors
    }

    return { getColors }
}