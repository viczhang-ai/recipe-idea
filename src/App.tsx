import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Publish from './pages/Publish';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import RecipeDetail from './pages/RecipeDetail';
import Cooking from './pages/Cooking';
import Reviews from './pages/Reviews';
import PublishReview from './pages/PublishReview';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import CategoryDetail from './pages/CategoryDetail';
import CuratedList from './pages/CuratedList';
import CookingClass from './pages/CookingClass';
import IngredientWiki from './pages/IngredientWiki';
import MyRecipes from './pages/MyRecipes';
import History from './pages/History';
import Settings from './pages/Settings';
import About from './pages/About';
import Followers from './pages/Followers';
import Following from './pages/Following';
import AccountManagement from './pages/AccountManagement';
import PrivacySettings from './pages/PrivacySettings';
import NotificationSettings from './pages/NotificationSettings';
import FontSizeSettings from './pages/FontSizeSettings';
import DarkModeSettings from './pages/DarkModeSettings';
import HelpSupport from './pages/HelpSupport';
import Search from './pages/Search';
import EditProfile from './pages/EditProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageRecipes from './pages/admin/ManageRecipes';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCategories from './pages/admin/ManageCategories';
import ManageReviews from './pages/admin/ManageReviews';
import AdminSettings from './pages/admin/AdminSettings';
import { AdminGuard } from './components/AdminGuard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="categories" element={<Categories />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/search" element={<Search />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/recipe/:id/cook/:step" element={<Cooking />} />
          <Route path="/recipe/:id/reviews" element={<Reviews />} />
          <Route path="/recipe/:id/review/new" element={<PublishReview />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/category/:id" element={<CategoryDetail />} />
          <Route path="/curated" element={<CuratedList />} />
          <Route path="/class" element={<CookingClass />} />
          <Route path="/wiki" element={<IngredientWiki />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          } />
          <Route path="/admin/recipes" element={
            <AdminGuard>
              <ManageRecipes />
            </AdminGuard>
          } />
          <Route path="/admin/users" element={
            <AdminGuard>
              <ManageUsers />
            </AdminGuard>
          } />
          <Route path="/admin/categories" element={
            <AdminGuard>
              <ManageCategories />
            </AdminGuard>
          } />
          <Route path="/admin/reviews" element={
            <AdminGuard>
              <ManageReviews />
            </AdminGuard>
          } />
          <Route path="/admin/settings" element={
            <AdminGuard>
              <AdminSettings />
            </AdminGuard>
          } />

          <Route path="/about" element={<About />} />
          <Route path="/followers" element={<Followers />} />
          <Route path="/following" element={<Following />} />
          <Route path="/settings/account" element={<AccountManagement />} />
          <Route path="/settings/privacy" element={<PrivacySettings />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
          <Route path="/settings/fontsize" element={<FontSizeSettings />} />
          <Route path="/settings/darkmode" element={<DarkModeSettings />} />
          <Route path="/settings/help" element={<HelpSupport />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
