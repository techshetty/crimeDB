'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, MapPin, Calendar, UserCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface CriminalRecord {
  criminal_id: string;
  imagedata: string;
  name: string;
  gender: string;
  age: number;
  address: string;
  arrest_date: string;
}

interface ApiResponse {
  success: boolean;
  data: CriminalRecord;
}

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<CriminalRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [load,setLoad]=useState(true)
  const router=useRouter();
  useEffect(()=>{
    const checkReg=async()=>{
            try{
            const res=await fetch(`${process.env.NEXT_PUBLIC_BHOST}/check_reg`,{
                credentials: "include"
            })
            const rd=await res.json();
            if(rd.success){
                setLoad(false)
            }
            else{
                router.push('/login')
            }
        }
        catch(error){
            router.push('/login')
        }
        } 
        checkReg();
  },[])
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/findcrim?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (data.success) {
        console.dir(data.data)
        setSearchResults(data.data[0]);
      } else {
        setError('No records found');
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
if(load)return <></>
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Search className="h-6 w-6 text-blue-600" />
              Criminal Record Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter criminal ID or name..."
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {searchResults && (
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <img
                    src={`data:image/png;base64, ${searchResults.imagedata}`}
                    alt="Criminal photo"
                    className="w-full rounded-lg shadow-lg mb-4"
                  />
                  <p className="text-center text-sm text-gray-500">ID: {searchResults.criminal_id}</p>
                </div>
                <div className="w-full md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold">{searchResults.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Gender & Age</p>
                        <p className="font-semibold">{searchResults.gender}, {searchResults.age} years</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-semibold">{searchResults.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Arrest Date</p>
                        <p className="font-semibold">{new Date(searchResults.arrest_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SearchPage;