"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Users, UserCheck, UserX, MoreHorizontal, CheckCircle2, FilterX, Building2, ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { mockCandidates } from "@/lib/mock-data/candidates";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  // View states
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredCandidates.map(c => c.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleVerifySelected = () => {
    setCandidates(candidates.map(c => 
      selectedIds.has(c.id) ? { ...c, status: "Verified" } : c
    ));
    setSelectedIds(new Set());
  };

  const handleVerifySingle = (id: string) => {
    setCandidates(candidates.map(c => 
      c.id === id ? { ...c, status: "Verified" } : c
    ));
    setOpenDropdownId(null);
  };

  // Extract unique departments and their stats
  const departmentStats = useMemo(() => {
    const uniqueDepts = new Set(candidates.map(c => c.department));
    return Array.from(uniqueDepts).filter(Boolean).sort().map(deptName => {
      const deptCandidates = candidates.filter(c => c.department === deptName);
      return {
        name: deptName,
        total: deptCandidates.length,
        verified: deptCandidates.filter(c => c.status === "Verified").length,
        pending: deptCandidates.filter(c => c.status === "Pending").length,
      };
    });
  }, [candidates]);

  // Apply filters for the table view
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      if (selectedDepartment && c.department !== selectedDepartment) return false;
      
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [candidates, searchQuery, selectedDepartment]);

  const hasActiveFilters = searchQuery !== "";

  const clearFilters = () => {
    setSearchQuery("");
  };

  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
    setSearchQuery("");
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={selectedDepartment ? `Candidates: ${selectedDepartment}` : "Candidate Registrations"} 
        description={selectedDepartment ? "Manage registered candidates for this department." : "Select a department to view and manage its candidates."}
      >
        <div className="flex gap-2">
          {selectedDepartment && (
            <Button variant="outline" onClick={handleBackToDepartments} className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Departments
            </Button>
          )}
          {selectedIds.size > 0 && (
            <Button 
              variant="outline" 
              className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700"
              onClick={handleVerifySelected}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Verify Selected ({selectedIds.size})
            </Button>
          )}
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </PageHeader>

      {!selectedDepartment ? (
        // Department Grid View
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard 
              title="Total Registered" 
              value={candidates.length.toString()} 
              description="+180 this week" 
              icon={Users} 
            />
            <MetricCard 
              title="Verified Candidates" 
              value={candidates.filter(c => c.status === "Verified").length.toString()} 
              description={`${Math.round((candidates.filter(c => c.status === "Verified").length / candidates.length) * 100)}% of total registrations`} 
              icon={UserCheck} 
              iconColor="text-emerald-500"
            />
            <MetricCard 
              title="Pending Verification" 
              value={candidates.filter(c => c.status === "Pending").length.toString()} 
              description="Requires manual review" 
              icon={UserX} 
              iconColor="text-amber-500"
            />
          </div>

          <h3 className="text-lg font-medium mt-8 mb-4">Departments</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departmentStats.map(dept => (
              <Card 
                key={dept.name} 
                className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                onClick={() => setSelectedDepartment(dept.name)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    {dept.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">{dept.total}</p>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">{dept.verified}</p>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Verified</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-600">{dept.pending}</p>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        // Candidate Table View
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <CardTitle>Registration List</CardTitle>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-500 h-8">
                    <FilterX className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input 
                    placeholder="Search by name, email or ID..." 
                    className="pl-8" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                      checked={selectedIds.size === filteredCandidates.length && filteredCandidates.length > 0}
                      onChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Candidate ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No candidates found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCandidates.map((c) => (
                    <TableRow key={c.id} className={selectedIds.has(c.id) ? "bg-slate-50" : ""}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                          checked={selectedIds.has(c.id)}
                          onChange={() => handleSelectOne(c.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium font-mono text-xs">{c.id}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell className="text-slate-500">{c.email}</TableCell>
                      <TableCell className="text-slate-500">{c.date}</TableCell>
                      <TableCell>
                        <Badge variant={
                          c.status === "Verified" ? "success" : 
                          c.status === "Pending" ? "warning" : "destructive"
                        }>
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right relative">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setOpenDropdownId(openDropdownId === c.id ? null : c.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        
                        {openDropdownId === c.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setOpenDropdownId(null)} 
                            />
                            <div className="absolute right-4 top-10 z-20 w-48 rounded-md border border-slate-200 bg-white shadow-md outline-none py-1">
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
                                onClick={() => handleVerifySingle(c.id)}
                                disabled={c.status === "Verified"}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Verify Candidate
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
                                onClick={() => setOpenDropdownId(null)}
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Reject Registration
                              </button>
                            </div>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
