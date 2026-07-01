import { Outlet, NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ClockIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

function Layout() {
  return (
    <div className="flex h-screen bg-light">
      {/* 侧边导航栏 */}
      <nav className="w-64 bg-white shadow-md">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-primary">叶病害检测</h1>
        </div>
        <div className="px-4 py-2">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <HomeIcon className="w-5 h-5 mr-3" />
                <span>仪表盘</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <ClockIcon className="w-5 h-5 mr-3" />
                <span>历史记录</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Cog6ToothIcon className="w-5 h-5 mr-3" />
                <span>设置</span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="absolute bottom-0 w-64 border-t border-gray-200">
          <div className="px-4 py-4">
            <button className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <UserCircleIcon className="w-5 h-5 mr-3" />
              <span>用户</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout; 