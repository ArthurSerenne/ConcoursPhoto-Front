import { useAuth } from '../components/AuthContext';

const Profil = () => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return (
            <div>
                <p>Veuillez vous connecter pour accéder à cette page.</p>
            </div>
        );
    }

    return (
        <div className='mx-12 md:mx-24'>
            <div className="mx-auto mt-10 mb-8 flex flex-wrap justify-between items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <p><span>Accueil</span> {'>'} <span className="font-bold">Mon compte</span></p>
            </div>
            <div className="mx-auto mt-8 mb-12 flex flex-wrap justify-between items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <p className="text-4xl font-bold not-italic leading-[160%] text-black leading-tight">Mon compte</p>
                <p>ID utilisateur : {user && user.id}</p>
            </div>
        </div>
    );
}

export default Profil;
