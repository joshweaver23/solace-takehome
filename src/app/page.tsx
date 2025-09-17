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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthcare Advocates</h1>
        <p className="text-gray-600">Find the right advocate for your healthcare needs</p>
      </div>

      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
          Search Advocates
        </label>
        {searchTerm && (
          <p className="text-sm text-gray-500 mb-3" aria-live="polite">
            Searching for: <span className="font-medium text-gray-900">{searchTerm}</span>
          </p>
        )}
        <div className="flex gap-3">
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            onChange={onChange}
            aria-describedby="search-description"
            placeholder="Search by name, city, degree, specialty, or experience"
          />
          <button
            onClick={onClick}
            aria-label="Clear search and show all advocates"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear
          </button>
        </div>
        <p id="search-description" className="sr-only">
          Search through advocate profiles by typing any part of their name, location, degree, specialty, or years of experience
        </p>
      </div>
      {isLoading ? (
        <div aria-live="polite">Loading advocates...</div>
      ) : (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Healthcare Advocates Directory
            </h2>
            <p className="text-sm text-gray-500">
              {filteredAdvocates.length} advocate{filteredAdvocates.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" role="table" aria-label="List of healthcare advocates">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credentials</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialties</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdvocates.map((advocate, index) => {
                  return (
                    <tr key={`advocate-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {advocate.firstName} {advocate.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{advocate.city}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {advocate.degree}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {advocate.specialties.slice(0, 3).map((specialty: string, specialtyIndex: number) => (
                            <span key={`specialty-${index}-${specialtyIndex}`} className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                              {specialty}
                            </span>
                          ))}
                          {advocate.specialties.length > 3 && (
                            <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                              +{advocate.specialties.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{advocate.yearsOfExperience} years</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href={`tel:${advocate.phoneNumber}`} className="text-blue-600 hover:text-blue-900 text-sm">
                          {advocate.phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
