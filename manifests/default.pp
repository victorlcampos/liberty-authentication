$home         = '/home/vagrant'
$as_vagrant   = 'sudo -u vagrant -H bash -l -c'

Exec {
  path => ['/usr/sbin', '/usr/bin', '/sbin', '/bin', '/usr/local/bin']
}

stage { 'preinstall':
  before => Stage['packages']
}

class preinstall {
  exec { "apt-update":
    command => "apt-get -y update",
    unless => "test -e ${home}/.rvm"
  }

  class {'locales':
    locales => 'en_US.UTF-8 UTF-8',
  }
}
class { 'preinstall':
  stage => preinstall
}

stage { 'packages':
  before => Stage['main']
}

class install_packages {
  package { [ 'curl',
              'build-essential',
              'libfontconfig1',
              'python',
              'g++',
              'make',
              'wget',
              'tar',
              'mc',
              'htop',
              'rubygems',
              'zlib1g-dev',
              'libssl-dev',
              'libreadline-dev',
              'git-core',
              'libxml2',
              'libxml2-dev',
              'libxslt1-dev',
              'sqlite3',
              'libsqlite3-dev',
            ]:
    ensure => present
  }
}

class { 'install_packages': stage => packages }

class install_nodeJS {
  class { 'nodejs':
    version => 'stable'
  }

  package { [
      'grunt-init',
      'express',
      'express-generator'
    ]:
    provider => npm,
    ensure => present,
    require => Class['nodejs']
  }
}

class { 'install_nodeJS': }

class {'::mongodb::globals':
  manage_package_repo => true,
}->
class {'::mongodb::server': }