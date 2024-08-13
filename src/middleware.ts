import { NextResponse, NextRequest } from 'next/server';

import optimizelySdk from '@optimizely/optimizely-sdk';
 
export const config = { matcher: '/' };
 
export async function middleware(req: NextRequest, res: NextResponse) {

    const userId = 'user123' // change this to the user ID you want to track

    // function to fetch the datafile from the CDN

    async function fetchDatafileFromCDN() {
        const sdkKey = process.env.OPTIMIZELY_SDK_KEY;
      
        console.log(`Fetching Optimizely Datafile for SDK Key: ${sdkKey}`);
      
        try {
          const response = await fetch(`https://cdn.optimizely.com/datafiles/${sdkKey}.json`, {next: { revalidate: 0 }});
          console.log(`Optimizely Datafile fetched successfully`);
          const responseJson = await response.json();
          return responseJson;
        } catch (error) {
          console.log(error)
        }
      }

    // Get the datafile
    const datafile = await fetchDatafileFromCDN();
  
    // Initialize the SDK
    const instance = optimizelySdk.createInstance({
        sdkKey: datafile
    })

    const user = instance?.createUserContext(userId);

    console.log(user)

    const response = NextResponse.next();

    return response;
}
