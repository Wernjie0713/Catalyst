import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/Components/ui/table";
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
  
export default function AdminDashboard({ users, links }) {
    if (!users || users.length === 0) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-black hover:bg-black">
                                <TableHead className="w-[5%] text-center font-semibold text-white">No.</TableHead>
                                <TableHead className="w-[20%] font-semibold text-white">Name</TableHead>
                                <TableHead className="w-[25%] font-semibold text-white">Email</TableHead>
                                <TableHead className="w-[10%] font-semibold text-white">Matric No.</TableHead>
                                <TableHead className="w-[15%] font-semibold text-white">Phone No.</TableHead>
                                <TableHead className="w-[15%] font-semibold text-white">University</TableHead>
                                <TableHead className="w-[10%] font-semibold text-white">Faculty</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={7}>No users found.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    // Add a new state to keep track of the current page
    const [currentPage, setCurrentPage] = useState(1);

    // Update currentPage when links change
    useEffect(() => {
        if (links && links.length > 0) {
            const currentPageLink = links.find(link => link.active);
            if (currentPageLink) {
                setCurrentPage(parseInt(currentPageLink.label));
            }
        }
    }, [links]);

    // Calculate the starting index for the current page
    const startIndex = (currentPage - 1) * 10;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className='bg-white rounded-lg shadow p-4 sm:p-6 mt-6'>
                <div className="space-y-6">
                    <div className="relative flex flex-col sm:flex-row items-center justify-between pt-4 pb-2">
                        {/* Spacer */}
                        {/* <div className="sm:w-1/4 mb-4 sm:mb-0"></div> */}

                        {/* Title */}
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center whitespace-nowrap">
                            Registered Users
                        </h1>

                        {/* {!isAdmin && (
                            <div className="sm:w-1/4 mb-4 sm:mb-0"></div>
                        )} */}

                        {/* Export Button for Admin */}
                        {/* {isAdmin && (
                            <div className="sm:w-1/4 flex justify-end mt-4 sm:mt-0">
                                <Button onClick={handleExport}>
                                    Export to Excel
                                </Button>
                            </div>
                        )} */}
                    </div>

                    <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-black hover:bg-black">
                                    <TableHead className="w-[5%] text-center font-semibold text-white">No.</TableHead>
                                    <TableHead className="w-[20%] font-semibold text-white">Name</TableHead>
                                    <TableHead className="w-[25%] font-semibold text-white">Email</TableHead>
                                    <TableHead className="w-[10%] font-semibold text-white">Matric No.</TableHead>
                                    <TableHead className="w-[15%] font-semibold text-white">Phone No.</TableHead>
                                    <TableHead className="w-[15%] font-semibold text-white">University</TableHead>
                                    <TableHead className="w-[10%] font-semibold text-white">Faculty</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.slice(0, 10).map((user, index) => (
                                    <TableRow key={user.id} className={`hover:bg-gray-100 transition-colors duration-200`}>
                                        <TableCell className={`text-center font-normal`}>{startIndex + index + 1}.</TableCell>
                                        <TableCell className={`font-normal`}>{user.name}</TableCell>
                                        <TableCell className={`font-normal`}>{user.email}</TableCell>
                                        <TableCell className={`font-normal`}>{user.matric_no}</TableCell>
                                        <TableCell className={`font-normal`}>{user.phone_no}</TableCell>
                                        <TableCell className={`font-normal`}>{user.university}</TableCell>
                                        <TableCell className={`font-normal`}>{user.faculty}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {links && links.length > 0 && (
                        <div className="flex justify-center mt-6">
                            <nav aria-label="Page navigation">
                                <ul className="inline-flex rounded-md shadow-sm">
                                    {links.map((link, index) => (
                                        <li key={index}>
                                            <Link
                                                href={link.url}
                                                className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border ${
                                                    index === 0 ? 'rounded-l-md' : ''
                                                } ${
                                                    index === links.length - 1 ? 'rounded-r-md' : ''
                                                } ${
                                                    link.active
                                                        ? 'bg-black text-white border-gray-500 hover:bg-black hover:text-white'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-200'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-700'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}