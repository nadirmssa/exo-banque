/**
 * Intéragir avec une API JSON
 * @param {string} url
 * @param {RequestInit} options
 * @returns
 */
export async function fetchJSON(url, options = {}) {
    const header = {Accept: 'application/json',...options.header}
    const res = await fetch(url, {...options, header})
    if(!res.ok){
        throw new Error('Error servor', {cause: res});
    }
    return await res.json();
}