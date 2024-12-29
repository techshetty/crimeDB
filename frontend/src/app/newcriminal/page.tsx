'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { json } from 'stream/consumers';
import { useRouter } from 'next/navigation';

interface CriminalFormData {
  name: string;
  gender: string;
  age: string;
  addr: string;
  arrest_date: string;
}

const AddCriminalPage: React.FC = () => {
  const router=useRouter();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
const[load,setLoad]=useState(true);
  const [formData, setFormData] = useState<CriminalFormData>({
    name: '',
    gender: '',
    age: '',
    addr: '',
    arrest_date: ''
  });

  useEffect(() => {
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
    if (!isCapturing) return;
    
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        toast.error('Failed to access camera');
      }
    };

    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [isCapturing]);

  const handleCapture = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0);
    
    const imageData = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    setCapturedImage(imageData);
    setIsCapturing(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/newcrim`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              gender: formData.gender,
              age: parseInt(formData.age),
              address: formData.addr,
              arrest_date: formData.arrest_date,
              imageData: capturedImage
            }),
          });
      
      if (response.ok) {
        toast.success('Record added successfully');
        // Reset form
        setCapturedImage('');
        setFormData({
          name: '',
          gender: '',
          age: '',
          addr: '',
          arrest_date: ''
        });
      } else {
        throw new Error();
      }
    } catch {
      toast.error('Failed to save record');
    } finally {
      setLoading(false);
    }
  };
  if(load) return <></>
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Criminal Record</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  title="gender" 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="Enter age"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input
                  value={formData.addr}
                  onChange={(e) => setFormData({...formData, addr: e.target.value})}
                  placeholder="Enter address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Arrest Date</label>
                <Input
                  type="date"
                  value={formData.arrest_date}
                  onChange={(e) => setFormData({...formData, arrest_date: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {isCapturing ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                    <Button 
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                      onClick={handleCapture}
                    >
                      Capture Photo
                    </Button>
                  </>
                ) : capturedImage ? (
                  <div className="relative">
                    <img 
                      src={`data:image/jpeg;base64,${capturedImage}`}
                      alt="Captured face" 
                      className="w-full h-full object-cover"
                    />
                    <Button 
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setCapturedImage('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    onClick={() => setIsCapturing(true)}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                )}
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!capturedImage || loading || !formData.name || !formData.age || !formData.gender}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Record'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCriminalPage;