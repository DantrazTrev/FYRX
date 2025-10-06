import React, { useEffect, useState } from 'react';
import Card from './Card';
import Emotions from './emotions';
import Upload from './Upload';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
const Cards = ({ currTab, searchQuery = '' }) => {
  const { uid } = useSelector((state) => state.firebase.auth);
  const firebase = useFirebase();
  const firestore = useFirestore();
  const [exv, setExv] = useState([]);
  const [upv, setUp] = useState([]);
  const [vid, setvid] = useState('');
  const [isPrivate, setPrivate] = useState(false);
  const [filteredUpls, setFilterd] = useState([]);
  useEffect(() => {
    const temp = [];
    const upls = [];
    firestore
      .collection(`videos`)
      .get()
      .then((vids) => {
        vids.forEach((vid) => {
          temp.push({ id: vid.id, ...vid.data() });
          console.log('BRE', vid.data());
        });
        setExv(temp);
      });
    if (uid) {
      firestore
        .collection(`users/${uid}/videos`)
        .get()
        .then((vids) => {
          vids.forEach((vid) => {
            upls.push({ id: vid.id, ...vid.data() });
            console.log('BRE', vid.data());
          });
          setUp(upls);
        });
    }
  }, [uid]);

  if (vid !== '' && !isPrivate) {
    return <Navigate replace to={`/video?id=${vid}`} push={true} />;
  } else if (vid !== '' && isPrivate) {
    return <Navigate replace to={`/v?id=${vid}`} push={true} />;
  }
  const filter = (emotion_id) => {
    let new_Exvs = exv.filter((vid) => vid.emotion_id === emotion_id);
    const url = new URL(window.location);
    url.searchParams.set('emotion_id', emotion_id);
    window.history.pushState({}, '', url);
    setFilterd(new_Exvs);
  };
  // Filter videos based on search query
  const filterVideos = (videos) => {
    if (!searchQuery.trim()) return videos;
    return videos.filter(video => 
      video.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredExv = filterVideos(exv);
  const filteredUpv = filterVideos(upv);

  return (
    <>
      {currTab === 'ex' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExv.length > 0 ? (
            filteredExv.map((item) => (
              <Card
                key={item.id}
                item={item}
                setvid={setvid}
                setPrivate={() => setPrivate(false)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 dark:text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v8.586l2.707 2.707A1 1 0 0120 17v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4a1 1 0 01.293-1.707L7 12.586V4a1 1 0 011-1z" />
                </svg>
                <p className="text-lg font-medium">No videos found</p>
                <p className="text-sm mt-1">Try adjusting your search terms</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {currTab === 'emotions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Emotions filter={filter} filteredUpls={filteredUpls} />
        </div>
      )}
      
      {currTab === 'my' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Upload />
          {filteredUpv.length > 0 ? (
            filteredUpv.map((item) => (
              <Card
                key={item.id}
                item={item}
                setvid={setvid}
                setPrivate={() => setPrivate(true)}
              />
            ))
          ) : uid && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 dark:text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v8.586l2.707 2.707A1 1 0 0120 17v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4a1 1 0 01.293-1.707L7 12.586V4a1 1 0 011-1z" />
                </svg>
                <p className="text-lg font-medium">No videos found</p>
                <p className="text-sm mt-1">Upload your first video to get started</p>
              </div>
            </div>
          )}
        </div>
      )}

      {currTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Analytics Cards */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Videos</p>
                  <p className="text-2xl font-bold">{exv.length + upv.length}</p>
                </div>
                <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Public Videos</p>
                  <p className="text-2xl font-bold">{exv.length}</p>
                </div>
                <svg className="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">My Videos</p>
                  <p className="text-2xl font-bold">{upv.length}</p>
                </div>
                <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Emotions Detected</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
                <svg className="w-8 h-8 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 011.5 1.5V12a1.5 1.5 0 01-1.5 1.5H9m0-4.5V9a1.5 1.5 0 011.5-1.5H12a1.5 1.5 0 011.5 1.5v1.5M9 10v4.5" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Detailed analytics coming soon...
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Cards;
