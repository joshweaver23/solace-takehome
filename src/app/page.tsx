"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Advocate, AdvocateApiResponse } from "../types/advocate";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Memoized filtering logic - only recalculates when advocates or searchTerm changes
  const filteredAdvocates = useMemo(() => {
    if (!searchTerm.trim()) {
      return advocates;
    }

    const searchLower = searchTerm.toLowerCase();
    return advocates.filter((advocate: Advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchLower) ||
        advocate.lastName.toLowerCase().includes(searchLower) ||
        advocate.city.toLowerCase().includes(searchLower) ||
        advocate.degree.toLowerCase().includes(searchLower) ||
        advocate.specialties.some(specialty =>
          specialty.toLowerCase().includes(searchLower)
        ) ||
        advocate.yearsOfExperience.toString().includes(searchTerm) ||
        advocate.phoneNumber.toString().includes(searchTerm)
      );
    });
  }, [advocates, searchTerm]);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        console.log("fetching advocates...");
        const response = await fetch("/api/advocates");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse: AdvocateApiResponse = await response.json();
        setAdvocates(jsonResponse.data);
      } catch (error) {
        console.error("Failed to fetch advocates:", error);
        // TODO: set an error state here for user feedback
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  // Memoized event handler to prevent unnecessary re-renders
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const onClick = useCallback(() => {
    console.log(advocates);
    setSearchTerm("");
  }, [advocates]);

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <label htmlFor="search-input">
          <p>Search Advocates</p>
        </label>
        <p>
          Searching for: <span aria-live="polite">{searchTerm}</span>
        </p>
        <input
          id="search-input"
          type="text"
          value={searchTerm}
          style={{ border: "1px solid black" }}
          onChange={onChange}
          aria-describedby="search-description"
          placeholder="Search by name, city, degree, specialty, or experience"
        />
        <p id="search-description" className="sr-only">
          Search through advocate profiles by typing any part of their name, location, degree, specialty, or years of experience
        </p>
        <button onClick={onClick} aria-label="Clear search and show all advocates">Reset Search</button>
      </div>
      <br />
      <br />
      {isLoading ? (
        <div aria-live="polite">Loading advocates...</div>
      ) : (
        <table role="table" aria-label="List of healthcare advocates">
        <caption>
          Healthcare Advocates Directory - {filteredAdvocates.length} advocate{filteredAdvocates.length !== 1 ? 's' : ''} found
        </caption>
        <thead>
          <tr>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">City</th>
            <th scope="col">Degree</th>
            <th scope="col">Specialties</th>
            <th scope="col">Years of Experience</th>
            <th scope="col">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate, index) => {
            return (
              <tr key={`advocate-${index}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((specialty: string, specialtyIndex: number) => (
                    <div key={`specialty-${index}-${specialtyIndex}`}>{specialty}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
        </table>
      )}
    </main>
  );
}
