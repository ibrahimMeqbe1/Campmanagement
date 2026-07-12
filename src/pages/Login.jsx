import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser, FaSignInAlt } from "react-icons/fa";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmedUser = username.trim();
    
    // التحقق من الحسابات المطلوبة فقط
    if ((trimmedUser === "Y2000" || trimmedUser === "I2000") && password === "0101Aa") {
      setTimeout(() => {
        const loggedUser = {
          email: `${trimmedUser.toLowerCase()}@kareem.com`,
          username: trimmedUser,
          uid: `kareem-user-${trimmedUser}`
        };
        localStorage.setItem("kareem_camp_logged_in", JSON.stringify(loggedUser));
        setUser(loggedUser);
        setLoading(false);
        navigate("/");
      }, 600);
    } else {
      setTimeout(() => {
        setError("خطأ في اسم المستخدم أو كلمة المرور. يرجى التحقق وإعادة المحاولة.");
        setLoading(false);
      }, 600);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* ترويسة بطاقة تسجيل الدخول مع الشعار */}
        <div className="login-header">
          <img src="/logo.jpg" alt="شعار مخيم كريم" className="login-logo" onError={(e) => e.target.style.display = 'none'} />
          <h1>مخيم كريم</h1>
          <p>لوحة تحكم إدارة سجلات العائلات والترشيحات</p>
        </div>

        {error && <div className="login-error-badge">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          {/* حقل اسم المستخدم */}
          <div className="login-form-group">
            <label htmlFor="username">
              <FaUser className="login-field-icon" /> اسم المستخدم
            </label>
            <input
              type="text"
              id="username"
              placeholder="أدخل اسم المستخدم هنا (Y2000 أو I2000)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* حقل كلمة المرور */}
          <div className="login-form-group">
            <label htmlFor="password">
              <FaLock className="login-field-icon" /> كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* زر تسجيل الدخول */}
          <button type="submit" className="btn-login-submit" disabled={loading}>
            {loading ? (
              <span className="spinner">جاري التحقق...</span>
            ) : (
              <>
                <FaSignInAlt /> دخول لوحة التحكم
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
