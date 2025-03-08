"use server"

import type { Job } from "@/types"
import { formatJobApiResponse } from "../utils"
import type { JobFilterParams } from "./shared.types"

export const fetchLocation = async () => {
  try {
    // IP API often has rate limits on free plans
    // Adding a timeout to prevent hanging if the API is slow
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const response = await fetch(
      `http://api.ipapi.com/api/check?access_key=${process.env.IP_API_ACCESS_KEY}&output=json&fields=main&language=en`,
      { signal: controller.signal },
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`IP API error: ${response.status} ${response.statusText}`)
      return ""
    }

    const result = await response.json()

    // Check if result and properties exist before accessing them
    if (result && result.region_name && result.country_name) {
      return `${result.region_name}, ${result.country_name}`
    }
    return ""
  } catch (error) {
    console.error("Error fetching location:", error)
    return ""
  }
}

export const fetchCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all")

    if (!response.ok) {
      console.error(`Countries API error: ${response.status} ${response.statusText}`)
      return []
    }

    const result = await response.json()
    const countriesCommonName = result.map((data: { name: { common: string } }) => data?.name?.common) ?? []
    const countryNames: string[] = countriesCommonName.filter(
      (item: null | undefined | string) => item !== null && item !== undefined,
    )
    countryNames.sort()
    return countryNames
  } catch (error) {
    console.error("Error fetching countries:", error)
    return []
  }
}

export const fetchJobs = async (filters: JobFilterParams) => {
  try {
    const { query, page } = filters

    // Validate inputs
    if (!query || query.trim() === "") {
      console.error("Empty query provided to fetchJobs")
      return []
    }

    // Encode the query for URL safety
    const encodedQuery = encodeURIComponent(query)

    // Use server-side environment variables without NEXT_PUBLIC_ prefix
    const apiKey = process.env.RAPID_API_KEY
    const apiHost = process.env.RAPID_API_HOST

    if (!apiKey || !apiHost) {
      console.error("Missing API credentials for job search")
      return []
    }

    const headers = {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": apiHost,
    }

    console.log(`Fetching jobs with query: ${encodedQuery}, page: ${page}`)

    const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodedQuery}&page=${page}`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`Job API error: ${response.status} ${response.statusText}`)
      // If we hit rate limits, return empty array
      if (response.status === 429) {
        console.error("Rate limit exceeded for job API")
      }
      return []
    }

    const jobsData = await response.json()

    // Add error handling for API response
    if (!jobsData.data) {
      console.error("Invalid API response - no data field:", jobsData)
      return []
    }

    if (!Array.isArray(jobsData.data)) {
      console.error("Invalid API response - data is not an array:", jobsData)
      return []
    }

    if (jobsData.data.length === 0) {
      console.log("No jobs found for query:", query)
      return []
    }

    const result: Job[] = jobsData.data.map((job: any) => formatJobApiResponse(job))

    console.log(`Found ${result.length} jobs for query: ${query}`)
    return result
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return []
  }
}

