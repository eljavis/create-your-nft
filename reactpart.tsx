import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, UploadCloud, CheckCircle, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ethers } from 'ethers';


const IPFS_GATEWAY = 'https://ipfs.io/ipfs/'; // Public IPFS Gateway (you can use pinata or another)

//Connect the contract with the react file.

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_baseMetadataURI",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      }
    ],
    "name": "mintNFT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
    {
    "inputs": [],
    "name": "_baseURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const contractAddress = '0xYourContractAddress'; // Replace with the actual address

// React Interface

const NFTMetadataUploader = () => {
    
    // States

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState(''); // Image preview
    const [attributes, setAttributes] = useState<{ trait_type: string; value: string }[]>([]);
    const [traitType, setTraitType] = useState('');
    const [value, setValue] = useState('');
    const [metadataUri, setMetadataUri] = useState('');
    const [mintSuccessful, setMintSuccessful] = useState(false);
    const [loading, setLoading] = useState(false);  // State to show the loader
    const [error, setError] = useState<string | null>(null); // State to handle errors

    
    // Helper Functions
    

    const connectWallet = useCallback(async () => {
        if (window.ethereum) {
            try {
                const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(ethersProvider);

                const ethSigner = ethersProvider.getSigner();
                setSigner(ethSigner);

                const nftContract = new ethers.Contract(contractAddress, contractABI, ethSigner);
                setContract(nftContract);
                setIsConnected(true);
            } catch (err: any) {
                setError(`Error connecting wallet: ${err.message || 'Unknown Error'}`);
                console.error(err);
            }
        } else {
            setError('Wallet not detected. Please install wallet.');
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            connectWallet();
        }
    }, [connectWallet]);

    // Function to read the image and display it in the preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
                setImage(file);  // Store the file to upload later
            };
            reader.readAsDataURL(file);
        }
    };

    // Function to add attributes to the list
    const addAttribute = () => {
        if (traitType && value) {
            setAttributes([...attributes, { trait_type: traitType, value }]);
            setTraitType('');
            setValue('');
        }
    };

    // Function to delete an attribute from the list
    const deleteAttribute = (index: number) => {
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    
    // IPFS Upload (Simulated)
    
    const uploadToIPFS = useCallback(async (data: any): Promise<string> => {
        setLoading(true);
        setError(null);
        // Simulate IPFS upload with a delay
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2 seconds of waiting

            // Here, we simulate a successful upload
            // and return a fictitious URL.
            console.log('Data uploaded to IPFS (simulated):', data);  // Show the data that was uploaded
            const simulatedCid = 'QmYourFakeCID'; // Simulate an IPFS CID
            const simulatedUrl = `${IPFS_GATEWAY}${simulatedCid}.json`; // Simulated URL

            setMetadataUri(simulatedUrl); // Update the state with the simulated URL
            return simulatedUrl;
        } catch (err: any) {
            setError(`Error uploading to IPFS: ${err.message || 'Unknown error'}`);
            throw err; // It is important to re-throw the error so that the caller can catch it
        } finally {
            setLoading(false);
        }
    }, []);

    
    // NFT Minting (Simulated)
    
    const mintNFT = useCallback(async () => {
        setLoading(true);
        setError(null);
        setMintSuccessful(false); // Reset the success state
        try {
            // 1. Upload the image to IPFS (simulated)
            let imageIpfsUrl = '';
            if (image) {
                const formData = new FormData();
                formData.append('file', image);
                // In a real app, here would be the logic to upload the image to IPFS
                // and get the URL.  Here we simulate the response.
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate image upload
                imageIpfsUrl = `${IPFS_GATEWAY}QmFakeImageCID.${image.name.split('.').pop()}`; // Simulated URL
                console.log('Image uploaded (simulated):', imageIpfsUrl);
            }


            // 2. Create the metadata object
            const metadata = {
                name,
                description,
                image: imageIpfsUrl, // Use the IPFS URL of the image
                attributes: attributes.map(attr => ({
                    trait_type: attr.trait_type,
                    value: attr.value,
                })),
            };

            // 3. Upload the metadata to IPFS
            const metadataUrl = await uploadToIPFS(metadata);

            // 4.  Simulate the call to the smart contract to mint the NFT
            
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate the transaction
            console.log('NFT minted (simulated) with URI:', metadataUrl);
            setMetadataUri(metadataUrl);
            setMintSuccessful(true);

        } catch (err: any) {
            setError(`Error minting the NFT: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    }, [name, description, image, attributes, uploadToIPFS]);

    
    // Rendering
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
                    Create your NFT and upload metadata to IPFS
                </h1>

                {/* Form for the NFT metadata */}
                <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white">NFT Metadata</CardTitle>
                        <CardDescription className="text-gray-400">
                            Enter the details of your NFT. This data will be stored on IPFS.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* NFT Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                Name
                            </label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="E.g.: My Awesome NFT"
                                className="mt-1 bg-black/20 text-white border-gray-700 placeholder:text-gray-500"
                            />
                        </div>

                        {/* NFT Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                                Description
                            </label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="E.g.: This is a unique and special NFT."
                                className="mt-1 bg-black/20 text-white border-gray-700 placeholder:text-gray-500 min-h-[100px]"
                            />
                        </div>

                        {/* NFT Image */}
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-300">
                                Image
                            </label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-1 bg-black/20 text-white border-gray-700"
                            />
                            {imageUrl && (
                                <div className="mt-2">
                                    <h4 className="text-md font-semibold text-gray-200">Preview:</h4>
                                    <img src={imageUrl} alt="Preview" className="max-w-full h-auto rounded-md border border-gray-700" />
                                </div>
                            )}
                        </div>

                        {/* NFT Attributes */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-200 mb-2">Attributes</h3>
                            <p className='text-gray-400 text-sm mb-2'>Add characteristics to your NFT (Optional)</p>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Type (E.g.: Color)"
                                        value={traitType}
                                        onChange={(e) => setTraitType(e.target.value)}
                                        className="bg-black/20 text-white border-gray-700 placeholder:text-gray-500"
                                    />
                                    <Input
                                        placeholder="Value (E.g.: Red)"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="bg-black/20 text-white border-gray-700 placeholder:text-gray-500"
                                    />
                                    <Button
                                        onClick={addAttribute}
                                        className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300"
                                        disabled={!traitType || !value}
                                    >
                                        Add
                                    </Button>
                                </div>
                                {attributes.map((attr, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-800/50 p-2 rounded-md border border-gray-700">
                                        <span className="text-gray-300 text-sm">{attr.trait_type}: {attr.value}</span>
                                        <Button
                                            onClick={() => deleteAttribute(index)}
                                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 text-xs"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Button to mint the NFT and upload metadata */}
                <div className="flex justify-center">
                    <Button
                        onClick={mintNFT}
                        disabled={loading}
                        className={cn(
                            "bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg",
                            "hover:from-purple-600 hover:to-blue-600 hover:scale-105 transition-all duration-300",
                            "disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        )}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin w-5 h-5" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-5 h-5" />
                                Create NFT and Upload Metadata
                            </>
                        )}
                    </Button>
                </div>

                {/* Success or error messages */}
                {mintSuccessful && (
                    <Alert className="bg-green-500/10 text-green-400 border-green-500/20">
                        <CheckCircle className="h-5 w-5" />
                        <AlertTitle>NFT Created Successfully!</AlertTitle>
                        <AlertDescription>
                            Your NFT metadata has been uploaded to IPFS. You can view it at:
                            <a href={metadataUri} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                                {metadataUri}
                            </a>
                        </AlertDescription>
                    </Alert>
                )}
                {error && (
                    <Alert variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20">
                        <AlertTriangle className="h-5 w-5" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default reactpart;
