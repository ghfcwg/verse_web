import https from 'https';

export interface VerseItem {
    id: string;
    content: string;
    title: string;
    reference: string;
    url: string;
    rating: number;
}

export function dbGetVerseListItems(query?: string): VerseItem[] {
    let ret: VerseItem[];

    const req = https.request(
        {hostname: 'chungwon.glass',
        port: 8443,
        path: `/query?q=${query}`,
        method: 'GET'}, 
        res => {
            console.log(`statusCode: ${res.statusCode}`)
        
            res.on('data', d => {
                ret = JSON.parse(d)
                return ret
            })
        })
        
    req.on('error', error => {
        console.error(error)
    })
    
    req.end()

    return []
}