import { Link } from 'react-router-dom';
import { Mail, EyeOff } from 'lucide-react';
import { InputField, Button } from '../components';
import toothSvg from '../assets/tooth.svg';
import loginBackground from '../assets/login_background.png';
import './Login.css';

const Login = () => {
    return (
        <div className="login-container">
            {/* Left Panel */}
            <div className="login-left-panel">
                <div
                    className="login-background-image"
                    style={{ backgroundImage: `url(${loginBackground})` }}
                />
                <div className="login-overlay" />

                <div className="login-left-content">
                    <div className="login-logo-circle">
                        <img src={toothSvg} alt="Diente Logo" className="login-logo-image" />
                    </div>
                    <h2 className="login-left-title">
                        Gestión Dental<br />Inteligente
                    </h2>
                    <p className="login-left-description">
                        Optimiza tu clínica con ATI Dental.<br />
                        Seguridad, eficiencia y control total de tus<br />pacientes en un solo lugar.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="login-right-panel">
                <div className="login-form-container">
                    <div className="login-header">
                        <div className="login-brand">
                            <svg width="24" height="24" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M28 -1.14441e-05C30.2 -1.14441e-05 32.0833 0.783321 33.65 2.34999C35.2167 3.91665 36 5.79999 36 7.99999C36 8.36665 35.975 8.85832 35.925 9.47499C35.875 10.0917 35.8 10.8 35.7 11.6L32.95 31.75C32.7833 33.0167 32.2083 34.05 31.225 34.85C30.2417 35.65 29.1167 36.05 27.85 36.05C27.0833 36.05 26.375 35.8833 25.725 35.55C25.075 35.2167 24.5333 34.75 24.1 34.15L18.75 26.35C18.6833 26.2167 18.575 26.125 18.425 26.075C18.275 26.025 18.1167 26 17.95 26C17.8167 26 17.55 26.15 17.15 26.45L11.95 34C11.4833 34.6667 10.9083 35.175 10.225 35.525C9.54167 35.875 8.81667 36.05 8.05 36.05C6.78333 36.05 5.66667 35.6417 4.7 34.825C3.73333 34.0083 3.16667 32.9667 3 31.7L0.3 11.6C0.2 10.8 0.125 10.0917 0.075 9.47499C0.025 8.85832 0 8.36665 0 7.99999C0 5.79999 0.783333 3.91665 2.35 2.34999C3.91667 0.783321 5.8 -1.14441e-05 8 -1.14441e-05C9.2 -1.14441e-05 10.1583 0.158321 10.875 0.474987C11.5917 0.791653 12.2833 1.13332 12.95 1.49999C13.6167 1.86665 14.325 2.20832 15.075 2.52499C15.825 2.84166 16.8 2.99999 18 2.99999C19.2 2.99999 20.175 2.84166 20.925 2.52499C21.675 2.20832 22.3833 1.86665 23.05 1.49999C23.7167 1.13332 24.4167 0.791653 25.15 0.474987C25.8833 0.158321 26.8333 -1.14441e-05 28 -1.14441e-05ZM28 3.99999C27.2333 3.99999 26.5583 4.15832 25.975 4.47499C25.3917 4.79165 24.75 5.13332 24.05 5.49999C23.35 5.86665 22.5333 6.20832 21.6 6.52499C20.6667 6.84165 19.4667 6.99999 18 6.99999C16.5333 6.99999 15.3333 6.84165 14.4 6.52499C13.4667 6.20832 12.65 5.86665 11.95 5.49999C11.25 5.13332 10.6083 4.79165 10.025 4.47499C9.44167 4.15832 8.76667 3.99999 8 3.99999C6.9 3.99999 5.95833 4.39165 5.175 5.17499C4.39167 5.95832 4 6.89999 4 7.99999C4 8.26665 4.01667 8.64999 4.05 9.14999C4.08333 9.64999 4.15 10.2333 4.25 10.9L7 31.15C7.03333 31.4167 7.15 31.625 7.35 31.775C7.55 31.925 7.78333 32 8.05 32C8.21667 32 8.36667 31.9667 8.5 31.9C8.63333 31.8333 8.73333 31.7333 8.8 31.6L13.85 24.2C14.3167 23.5333 14.9167 23 15.65 22.6C16.3833 22.2 17.1667 22 18 22C18.8333 22 19.6167 22.2 20.35 22.6C21.0833 23 21.6833 23.5333 22.15 24.2L27.3 31.75C27.3667 31.85 27.45 31.925 27.55 31.975C27.65 32.025 27.7667 32.05 27.9 32.05C28.1667 32.05 28.4083 31.975 28.625 31.825C28.8417 31.675 28.9667 31.4667 29 31.2L31.75 10.9C31.85 10.2333 31.9167 9.64999 31.95 9.14999C31.9833 8.64999 32 8.26665 32 7.99999C32 6.89999 31.6083 5.95832 30.825 5.17499C30.0417 4.39165 29.1 3.99999 28 3.99999Z" fill="currentColor" />
                            </svg>
                            ATI Dental
                        </div>
                        <h1 className="login-title">Bienvenido de nuevo</h1>
                        <p className="login-subtitle">Ingresa tus credenciales para acceder a tu panel</p>
                    </div>

                    <form className="login-form">
                        <div>
                            <InputField
                                label="Correo electrónico"
                                type="email"
                                name="email"
                                placeholder="ejemplo@correo.com"
                                icon={Mail}
                                required
                            />
                        </div>

                        <div>
                            <div className="login-forgot-password-container">
                                <label className="login-custom-label">Contraseña</label>
                            </div>
                            <InputField
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                icon={EyeOff}
                                required
                            />
                        </div>

                        <div className="login-submit-container">
                            <Button variant="primary" fullWidth className="login-submit-btn">
                                Iniciar Sesión
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;