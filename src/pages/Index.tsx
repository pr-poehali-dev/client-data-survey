import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type ApplicationStatus = 'pending' | 'processing' | 'approved' | 'rejected';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  amount: string;
}

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    amount: ''
  });
  
  const [status, setStatus] = useState<ApplicationStatus>('pending');
  const [timeLeft, setTimeLeft] = useState(900);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!applicationSubmitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [applicationSubmitted]);

  useEffect(() => {
    if (!applicationSubmitted) return;

    const totalTime = 900;
    const elapsed = totalTime - timeLeft;
    const progressPercent = (elapsed / totalTime) * 100;
    setProgress(progressPercent);

    if (timeLeft <= 660 && status === 'pending') {
      setStatus('processing');
      toast.info('Ваша заявка обрабатывается', {
        description: 'Мы проверяем ваши данные'
      });
    }

    if (timeLeft <= 180 && status === 'processing') {
      const isApproved = Math.random() > 0.3;
      setStatus(isApproved ? 'approved' : 'rejected');
      
      if (isApproved) {
        toast.success('Заявка одобрена!', {
          description: 'Мы свяжемся с вами в ближайшее время'
        });
      } else {
        toast.error('Заявка отклонена', {
          description: 'К сожалению, мы не можем одобрить вашу заявку'
        });
      }
    }
  }, [timeLeft, status, applicationSubmitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.amount) {
      toast.error('Заполните все поля', {
        description: 'Все поля обязательны для заполнения'
      });
      return;
    }

    setApplicationSubmitted(true);
    setStatus('pending');
    toast.success('Заявка отправлена!', {
      description: 'Мы начали обработку вашей заявки'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusConfig = (currentStatus: ApplicationStatus) => {
    const configs = {
      pending: {
        label: 'Получена',
        icon: 'Clock',
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      processing: {
        label: 'Обработка',
        icon: 'RefreshCw',
        color: 'bg-purple-500',
        textColor: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      approved: {
        label: 'Одобрена',
        icon: 'CheckCircle',
        color: 'bg-green-500',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      rejected: {
        label: 'Отклонена',
        icon: 'XCircle',
        color: 'bg-red-500',
        textColor: 'text-red-600',
        bgColor: 'bg-red-50'
      }
    };
    return configs[currentStatus];
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Подать заявку
          </h1>
          <p className="text-gray-600 text-lg">
            Заполните форму и мы рассмотрим вашу заявку за 12-15 минут
          </p>
        </div>

        {!applicationSubmitted ? (
          <Card className="shadow-2xl border-none animate-scale-in">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Анкета клиента</CardTitle>
              <CardDescription className="text-blue-50">
                Заполните все поля для подачи заявки
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-lg font-semibold">
                    ФИО
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Иванов Иван Иванович"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="h-12 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg font-semibold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ivan@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-lg font-semibold">
                    Телефон
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-12 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-lg font-semibold">
                    Сумма заявки
                  </Label>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="100 000 ₽"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="h-12 text-lg"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  Отправить заявку
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            
            <Card className="shadow-2xl border-none animate-scale-in bg-white/80 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Время рассмотрения</CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`${statusConfig.bgColor} ${statusConfig.textColor} border-none px-4 py-2 text-lg animate-pulse-glow`}
                  >
                    <Icon name={statusConfig.icon as any} className="mr-2" size={20} />
                    {statusConfig.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className={`text-7xl font-bold ${statusConfig.textColor} tabular-nums`}>
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-center text-gray-500 mt-2">
                      {timeLeft > 0 ? 'осталось' : 'завершено'}
                    </div>
                  </div>
                </div>

                <Progress value={progress} className="h-3" />

                <div className="text-center text-sm text-gray-500">
                  Прогресс: {Math.round(progress)}%
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-2xl border-none bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl">Статус заявки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-4">
                  
                  <div className={`flex flex-col items-center gap-2 flex-1 ${
                    status === 'pending' ? 'opacity-100' : 'opacity-40'
                  } transition-opacity`}>
                    <div className={`rounded-full p-4 ${
                      status === 'pending' ? 'bg-blue-500 animate-pulse-glow' : 'bg-gray-300'
                    }`}>
                      <Icon name="Clock" className="text-white" size={32} />
                    </div>
                    <span className="font-semibold text-center">Получена</span>
                  </div>

                  <div className="h-1 flex-1 bg-gray-200 rounded">
                    <div 
                      className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded transition-all duration-500 ${
                        status !== 'pending' ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>

                  <div className={`flex flex-col items-center gap-2 flex-1 ${
                    status === 'processing' ? 'opacity-100' : 'opacity-40'
                  } transition-opacity`}>
                    <div className={`rounded-full p-4 ${
                      status === 'processing' ? 'bg-purple-500 animate-pulse-glow' : 'bg-gray-300'
                    }`}>
                      <Icon name="RefreshCw" className={`text-white ${status === 'processing' ? 'animate-spin' : ''}`} size={32} />
                    </div>
                    <span className="font-semibold text-center">Обработка</span>
                  </div>

                  <div className="h-1 flex-1 bg-gray-200 rounded">
                    <div 
                      className={`h-full bg-gradient-to-r from-purple-500 to-green-500 rounded transition-all duration-500 ${
                        status === 'approved' || status === 'rejected' ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>

                  <div className={`flex flex-col items-center gap-2 flex-1 ${
                    status === 'approved' || status === 'rejected' ? 'opacity-100' : 'opacity-40'
                  } transition-opacity`}>
                    <div className={`rounded-full p-4 ${
                      status === 'approved' 
                        ? 'bg-green-500 animate-pulse-glow' 
                        : status === 'rejected' 
                        ? 'bg-red-500 animate-pulse-glow'
                        : 'bg-gray-300'
                    }`}>
                      <Icon 
                        name={status === 'rejected' ? 'XCircle' : 'CheckCircle'} 
                        className="text-white" 
                        size={32} 
                      />
                    </div>
                    <span className="font-semibold text-center">
                      {status === 'rejected' ? 'Отклонена' : 'Одобрена'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-2xl border-none bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <Icon name="Bell" size={32} className="flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Уведомления</h3>
                    <p className="text-blue-50">
                      Мы отправим вам уведомление на email и SMS при изменении статуса вашей заявки
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(status === 'approved' || status === 'rejected') && (
              <Button
                onClick={() => {
                  setApplicationSubmitted(false);
                  setTimeLeft(900);
                  setProgress(0);
                  setStatus('pending');
                  setFormData({ fullName: '', email: '', phone: '', amount: '' });
                }}
                variant="outline"
                className="w-full h-12 text-lg font-semibold"
              >
                Подать новую заявку
              </Button>
            )}
          </div>
        )}

        <Card className="shadow-xl border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Icon name="Code" size={24} />
              Код для вставки на Tilda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <code>
                {`<iframe src="${window.location.href}" 
  width="100%" 
  height="1200" 
  frameborder="0">
</iframe>`}
              </code>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Скопируйте этот код и вставьте его в блок HTML на вашем сайте Tilda
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
