import Head from 'next/head'


import {useEffect, useState} from 'react';


import Modal from "../components/Modal"
import Map from "../components/Map"
import ResidentsService from '../services/Residents';


function Home() {
  const [ showModal, setShowModal ] = useState(false);
  const [ residents, setResidents ] = useState(null);

  useEffect(() => {
    ResidentsService.getAll().then((residentsFetched) => {
      setResidents(residentsFetched);
    }).catch((e) => {
      console.error(e);
    });
  }, [])

  function addResident(resident)  {
    ResidentsService.create(resident).then((residentCreated) => {
      setResidents(residents.concat([residentCreated]));
    }).catch((e) => {
      console.error(e);
    });
  }

  return (
    <div className="container">
      <Head>
        <title>Tech U Localizator</title>
      </Head>

      <main>
        <h1 className="title">
          Welcome to <span>Tech U Localizator</span>
        </h1>

        <div id="modal-root"></div>
        <div className="w-full flex justify-center py-12" id="button">
          <button className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 mx-auto transition duration-150 ease-in-out hover:bg-orange-600 bg-orange-700 rounded text-white px-4 sm:px-8 py-2 text-xs sm:text-sm" onClick={() => setShowModal(true)}>Create resident</button>
        </div>
        
        <Modal
          onClose={() => setShowModal(false)}
          onCreate= {(resident) => {addResident(resident)}}
          show={showModal}
        >
          Hello from the modal!
        </Modal>

        {
          !residents ? <p>Loading...</p> : (<div><p>Total residents: {residents.length}</p><Map residents={residents} /></div>)
        }
        
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          @devduvan @davidzq @andivini @vamovill @paleont
        </a>
      </footer>
    </div>
  )
}


export default Home

